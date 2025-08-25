import { Request, Response, NextFunction } from "express";
import { CustomError, ResponseHandler, Logger } from "@/lib/utils";
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
      Logger: typeof Logger;
    },
  ) => void,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next, {
        CustomError,
        ResponseHandler,
        HttpRes,
        Logger,
      });
    } catch (error) {
      next(error);
    }
  };
}
