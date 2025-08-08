import { Request, Response, NextFunction } from "express";
import * as Yup from "yup";
import { CustomError } from "@/utils/custom-error";

// Error handler middleware
const errorMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // log the error (you can use a logging library here)
  console.error("Error occurred:", err);

  // check if the error is a Yup validation error
  if (err instanceof Yup.ValidationError) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: err.errors,
    });
  }

  // handle other types of errors
  if (err instanceof CustomError) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
      error: err.error,
    });
  }

  // handle unexpected errors
  return res.status(500).json({
    success: false,
    message: "Internal server error",
    error: "An unexpected error occurred",
  });
};

export default errorMiddleware;
