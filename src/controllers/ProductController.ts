import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { ProductService } from "../services";
import { ProductModel } from "../database/models/product";
import { changeResponse } from "../utils/changeResponse";

export class ProductController {
  public async find(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ProductService.findAll(req);
      console.log(result);
      res.status(StatusCodes.OK).json(changeResponse(true, result));
    } catch (e) {
      next(e);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await ProductService.create(req.body);

      res.status(StatusCodes.OK).json(changeResponse(true, created));
    } catch (e) {
      next(e);
    }
  }

  public async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const found = await ProductService.find({ _id: req.params.id });

      if (!found) {
        throw createHttpError(StatusCodes.NOT_FOUND, "Product not found");
      }

      res.status(StatusCodes.OK).json(changeResponse(true, found));
    } catch (e) {
      next(e);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: _id } = req.params;
      const { name, calories, protein, oil, carb } = req.body;

      const updated = await ProductModel.updateOne(
        { _id },
        { name, calories, protein, oil, carb }
      );

      if (!updated.modifiedCount) {
        throw createHttpError(StatusCodes.NOT_FOUND, "Product not found");
      }

      res
        .status(StatusCodes.OK)
        .json(changeResponse(true, { ...req.body, _id }));
    } catch (e) {
      next(e);
    }
  }

  public async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await ProductService.updateCategory(
        req.params.id,
        req.body.category
      );

      res.status(StatusCodes.OK).json(changeResponse(true, updated));
    } catch (e) {
      next(e);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await ProductService.delete(req.params.id);

      res.status(StatusCodes.OK).json(changeResponse(true, null));
    } catch (e) {
      next(e);
    }
  }
}
