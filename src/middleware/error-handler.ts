import { Request, Response, NextFunction } from "express";
import { CustomError, ResponseHandler, ValidationError } from "@/utils";

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
    return res.status(400).json(ResponseHandler.error(err.message, err.errors));
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
        "Internal Server Error",
        "An unexpected error occurred",
      ),
    );
};
