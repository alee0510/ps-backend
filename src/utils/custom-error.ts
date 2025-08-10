// ERROR MESSAGE
export const ERROR_MESSAGE = Object.freeze({
  INTERNAL_SERVER_ERROR: "Internal Server Error",
  VALIDATION_ERROR: "Validation Error",
  NOT_FOUND: "Resource Not Found",
  UNAUTHORIZED: "Unauthorized Access",
  FORBIDDEN: "Forbidden Access",
  BAD_REQUEST: "Bad Request",
  SERVICE_UNAVAILABLE: "Service Unavailable",
  CONFLICT: "Conflict Detected",
});

export const ERROR_DETAILS = Object.freeze({
  UNEXPECTED_ERROR: "An unexpected error occurred",
  NOT_FOUND: "The requested resource was not found",
  UNAUTHORIZED: "You are not authorized to access this resource",
  FORBIDDEN: "You do not have permission to perform this action",
  BAD_REQUEST: "The request was invalid or cannot be served",
  INTERNAL_SERVER_ERROR: "An internal server error occurred",
  SERVICE_UNAVAILABLE: "The service is currently unavailable",
  CONFLICT: "A conflict occurred with the current state of the resource",
});

export class CustomError extends Error {
  status: number;
  details: string;

  constructor(status: number, message: string, err?: string) {
    super(message);
    this.status = status;
    this.details = err || ERROR_DETAILS.UNEXPECTED_ERROR;
  }
}
