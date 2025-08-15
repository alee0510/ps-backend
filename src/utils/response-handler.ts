export const SUCCESS_MESSAGE = Object.freeze({
  RESOURCE_CREATED: "Resource created successfully",
  RESOURCE_UPDATED: "Resource updated successfully",
  RESOURCE_DELETED: "Resource deleted successfully",
  OPERATION_SUCCESSFUL: "Operation completed successfully",
  ACTION_COMPLETED: "Action completed successfully",
});

export const SUCCESS_CODES = Object.freeze({
  RESOURCE_CREATED: 201,
  RESOURCE_UPDATED: 200,
  RESOURCE_DELETED: 204,
  OPERATION_SUCCESSFUL: 200,
  ACTION_COMPLETED: 200,
});

export class ResponseHandler {
  success: boolean;
  message: string;
  data?: any | null;
  error?: string | string[] | null;
  count?: number;

  constructor(
    success: boolean,
    message: string,
    data?: any | null,
    error?: string | string[] | null,
  ) {
    this.success = success;
    this.message = message;
    if (success) {
      if (data !== undefined) {
        this.data = data;
        this.count = data?.length || 0;
      }
    } else {
      if (error !== undefined) {
        this.error = error;
      }
    }
  }

  static success(message: string, data: any) {
    return new ResponseHandler(true, message, data);
  }

  static error(message: string, error: string | string[] | null) {
    return new ResponseHandler(false, message, undefined, error);
  }
}
