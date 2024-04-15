import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { ObjectSchema, ValidationError } from "yup";
import { ValidateOptions } from "yup/lib/types";
import { Things, Handler } from "./../types/common";

const helpers = {
  validate: async <T extends Things<any>>(
    // @ts-ignore
    schema: ObjectSchema,
    value: T,
    options?: ValidateOptions
  ) => {
    try {
      return (await schema.validate(value, {
        abortEarly: false,
        stripUnknown: true,
        ...options,
      })) as T; // not sure when the data can be undefined?
    } catch (e) {
      const errors = (e as ValidationError).inner.reduce(
        // @ts-ignore
        (errors, current) => ({ ...errors, [current.path]: current.errors }),
        {}
      );

      throw createHttpError(StatusCodes.BAD_REQUEST, { payload: { errors } });
    }
  },
};

const Controller = <T extends Things<Handler>>(
  actions: (value: typeof helpers) => T
) => actions(helpers);

export default Controller;
