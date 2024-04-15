import { Request } from "express";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import CategoryService from "./CategoryService";
import { IProduct, ProductModel } from "../database/models/product";
import { UserModel } from "../database/models/user";
import { TrainerModel } from "../database/models/trainer";
import { CategoryDocument, CategoryModel } from "../database/models/category";
import { CATEGORY_TYPES, ROLES } from "../types/common";

const populate = ["category", "creatorUser", "creatorTrainer"];

const ProductService = {
  findAll: async (req: Request) => {
    let query: any = {};

    if (req.query.category) {
      query.category = req.query.category;
    }

    let result = await ProductModel.find(query).populate(populate);

    // if (!req.query.all) {
    //   result = result.filter(
    //     (p) => p.creatorUser && p.creatorUser.role === ROLES.SUPERADMIN
    //   );
    // }
    return result;
  },

  create: async (data: any): Promise<any | null | undefined> => {
    const {
      name,
      calories,
      protein,
      oil,
      carb,
      category: categoryId,
      creator: creatorId,
    } = data;

    const foundProduct = await ProductModel.findOne({
      $or: [
        { "name.en": name.en },
        { "name.ru": name.ru },
        { "name.uz": name.uz },
      ],
    });

    if (foundProduct) {
      let duplicateName = "";

      if (foundProduct.name.en === name.en) {
        duplicateName = name.en;
      }

      if (foundProduct.name.ru === name.ru) {
        duplicateName = name.ru;
      }

      if (foundProduct.name.uz === name.uz) {
        duplicateName = name.uz;
      }

      throw createHttpError(
        StatusCodes.BAD_REQUEST,
        `Product with "${duplicateName}" already created`
      );
    }

    const foundCategory = await CategoryModel.findById(categoryId);

    if (!foundCategory) {
      throw createHttpError(StatusCodes.NOT_FOUND, "Category not found");
    }

    if (foundCategory.type !== CATEGORY_TYPES.PRODUCT) {
      throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid category");
    }

    const foundUser = await UserModel.findById(creatorId);
    const foundTrainer = await TrainerModel.findById(creatorId);

    if (!(foundUser || foundTrainer)) {
      throw createHttpError(StatusCodes.NOT_FOUND, "creator not found");
    }

    let creator: any = {};

    if (foundUser) {
      creator.creatorUser = foundUser._id;
    }
    if (foundTrainer) {
      creator.creatorTrainer = foundTrainer._id;
    }

    const created = await ProductModel.create({
      name,
      calories,
      protein,
      oil,
      carb,
      category: foundCategory,
      ...creator,
    });

    if (foundUser) {
      foundUser.products = [...(foundUser.products ?? []), created];
      await foundUser.save();
    }
    if (foundTrainer) {
      foundTrainer.products = [...(foundTrainer.products ?? []), created];
      await foundTrainer.save();
    }

    return created;
  },

  find: async (
    condition: Partial<IProduct>
  ): Promise<any | null | undefined> => {
    return await ProductModel.findOne(condition).populate(populate);
  },

  updateCategory: async (
    _id: string,
    categoryId: string
  ): Promise<any | null | undefined> => {
    const category: CategoryDocument = await CategoryService.findOne({
      _id: categoryId,
    });

    if (!category) {
      throw createHttpError(StatusCodes.NOT_FOUND, "Category not found");
    }

    if (category.type !== CATEGORY_TYPES.PRODUCT) {
      throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid Category");
    }

    const product: IProduct = await ProductService.find({ _id });

    if (!product) {
      throw createHttpError(StatusCodes.NOT_FOUND, "Product not found");
    }

    if (product.category._id.toString() === category._id.toString()) {
      throw createHttpError(
        StatusCodes.BAD_REQUEST,
        "Category must be another Category"
      );
    }

    product.category = category;
    await ProductModel.findByIdAndUpdate(product._id, product);

    return product;
  },

  delete: async (_id: string): Promise<void> => {
    let product: IProduct = await ProductService.find({ _id });

    if (!product) {
      throw createHttpError(StatusCodes.NOT_FOUND, "Product not found");
    }

    if (product.creatorUser) {
      let user = await UserModel.findById(product.creatorUser._id);

      if (user) {
        user.products = [...(user.products ?? [])].filter(
          (p) => p._id.toString() !== product._id.toString()
        );

        await UserModel.findByIdAndUpdate(user._id, user);
      }
    }

    if (product.creatorTrainer) {
      let trainer = await TrainerModel.findById(product.creatorTrainer._id);

      if (trainer) {
        trainer.products = [...(trainer.products ?? [])].filter(
          (p) => p._id.toString() !== product._id.toString()
        );

        await TrainerModel.findByIdAndUpdate(trainer._id, trainer);
      }
    }

    await ProductModel.findByIdAndDelete(_id);
  },
};

export default ProductService;
