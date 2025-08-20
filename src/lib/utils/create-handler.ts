import { Request, Response, NextFunction } from "express";
import { CustomError, ResponseHandler } from "@/lib/utils";
import { HttpRes } from "@/lib/constant/http-response";

export function createHandler(
  handler: (
    req: Request,
    res: Response,
    next: NextFunction,
    utils: {
      CustomError: typeof CustomError;
      ResponseHandler: typeof ResponseHandler;
      HttpRes: typeof HttpRes;
    },
  ) => void,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next, {
        CustomError,
        ResponseHandler,
        HttpRes,
      });
    } catch (error) {
      next(error);
    }
  };
}
