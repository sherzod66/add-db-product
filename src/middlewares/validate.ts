import createHttpError from "http-errors";
import { Request, Response, NextFunction } from "express";
import { getStatusText, StatusCodes } from "http-status-codes";
import { ValidationError, ObjectSchema } from "yup";
import { changeResponse } from "./../utils/changeResponse";
import { objectIdRegex } from "./../constants/regex";

export const validate =
  // @ts-ignore


    (schema: ObjectSchema) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await schema.validate(req.body, {
          abortEarly: false,
          stripUnknown: true,
        });
        next();
      } catch (e) {
        const errors: any = (e as ValidationError).inner.reduce(
          // @ts-ignore
          (errors, current) => ({ ...errors, [current.path]: current.errors }),
          {}
        );

        res.status(StatusCodes.BAD_REQUEST).json(
          changeResponse(false, null, {
            code: StatusCodes.BAD_REQUEST,
            error: true,
            message: getStatusText(StatusCodes.BAD_REQUEST),
            payload: errors.payload || errors.data || errors,
          })
        );
      }
    };

export const validateIdParam = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  if (!id.match(objectIdRegex)) {
    throw createHttpError(
      StatusCodes.NOT_FOUND,
      getStatusText(StatusCodes.NOT_FOUND)
    );
  }

  next();
};
