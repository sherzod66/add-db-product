import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { CategoryModel } from "./../database/models/category/model";
import { changeResponse } from "./../utils/changeResponse";
import { IMyCustomCategory } from "./../database/models/category/types";
import { CategoryService } from "../services";
import fs from "fs";
import path from "path";
import { IMyProduct, IProduct, ProductModel } from "../database/models/product";

export class CategoryController {
  public async find(req: Request, res: Response, next: NextFunction) {
    try {
      let query: any = {};

      if (req.query.type) {
        query.type = req.query.type;
      }

      let result = await CategoryModel.find(query).populate([
        "parent",
        "children",
      ]);

      if (req.query.parents) {
        result = result.filter((c) => !c.parent);
      }

      res.status(StatusCodes.OK).json(changeResponse(true, result));
    } catch (e) {
      next(e);
    }
  }

  public async getParentCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await CategoryModel.find({
        parent: undefined,
        ...req.query,
      }).populate(["parent", "children"]);

      res.status(StatusCodes.OK).json(changeResponse(true, result));
    } catch (e) {
      next(e);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    console.log(req.body);
    const readData = fs.readFileSync(path.resolve(__dirname, "dataP.json"), {
      encoding: "utf-8",
    });

    const categoryAndProduct = JSON.parse(readData) as IMyCustomCategory[];
    console.log(categoryAndProduct.length);
    const products: IMyProduct[] = [];

    for (let i = 0; i < categoryAndProduct.length; i++) {
      const element = categoryAndProduct[i];
      const saved = await CategoryModel.create({
        name: element.name,
        type: element.type,
        parent: undefined,
      });
      console.log("hi see");
      if (element.producs)
        for (const pr of element.producs) {
          products.push({
            name: pr.name,
            calories: pr.calories,
            protein: pr.protein,
            oil: pr.oil,
            carb: pr.carb,
            category: saved,
          });
        }
    }
    console.log("конченно");
    for (const oneProduct of products) {
      if (oneProduct.calories.length < 5) {
        console.log(oneProduct.category._id);
        const findByName = await ProductModel.findOne({
          $or: [
            { "name.en": oneProduct.name.en },
            { "name.ru": oneProduct.name.ru },
            { "name.uz": oneProduct.name.uz },
          ],
        });
        if (!findByName)
          if (
            oneProduct.name.en.length > 0 &&
            oneProduct.name.ru.length > 0 &&
            oneProduct.name.uz.length > 0
          ) {
            console.log("product start");
            await ProductModel.create({
              name: oneProduct.name,
              calories: +oneProduct.calories,
              protein: +oneProduct.protein,
              oil: +oneProduct.oil,
              carb: +oneProduct.carb,
              category: oneProduct.category,
            });
            console.log("product finish");
          }
      }
    }
    res.json({ hi: "success" });
  }

  public async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const found = await CategoryService.findOne({ _id: req.params.id });

      if (!found) {
        throw createHttpError(StatusCodes.NOT_FOUND, "Category not found");
      }

      res.status(StatusCodes.OK).json(changeResponse(true, found));
    } catch (e) {
      next(e);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: _id } = req.params;

      const updated = await CategoryModel.updateOne({ _id }, { ...req.body });

      if (!updated.modifiedCount) {
        throw createHttpError(StatusCodes.NOT_FOUND, "Category not found");
      }

      res
        .status(StatusCodes.OK)
        .json(changeResponse(true, { ...req.body, _id }));
    } catch (e) {
      next(e);
    }
  }

  public async updateParent(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await CategoryService.updateParent(
        req.params.id,
        req.body.parent
      );

      res.status(StatusCodes.OK).json(changeResponse(true, updated));
    } catch (e) {
      next(e);
    }
  }

  public async updateChildren(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await CategoryService.updateChildren(
        req.params.id,
        req.body.children
      );

      res.status(StatusCodes.OK).json(changeResponse(true, updated));
    } catch (e) {
      next(e);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await CategoryService.delete(req.params.id);

      res.status(StatusCodes.OK).json(changeResponse(true, null));
    } catch (e) {
      next(e);
    }
  }
}
