import { Request, Response, NextFunction } from "express";
import {
  CustomError,
  ResponseHandler,
  ValidationError,
  ERROR_MESSAGE,
  ERROR_DETAILS,
  ERROR_CODES,
} from "@/lib/utils";

// Error handler middleware
export const errorMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // log the error (you can use a logging library here)
  console.error("Error occurred:", err);

  // check if the error is a Yup validation error
  if (err instanceof ValidationError) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .json(ResponseHandler.error(ERROR_MESSAGE.BAD_REQUEST, err.errors));
  }

  // handle other types of errors
  if (err instanceof CustomError) {
    return res
      .status(err.status)
      .json(ResponseHandler.error(err.message, err.details));
  }

  // handle unexpected errors
  return res
    .status(500)
    .json(
      ResponseHandler.error(
        ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
        ERROR_DETAILS.INTERNAL_SERVER_ERROR + `: ${(err as Error).message}` ||
          "Unknown error",
      ),
    );
};
