export class CustomError extends Error {
  status: number;
  error: string;

  constructor(status: number, message: string, err?: string) {
    super(message);
    this.status = status;
    this.error = err || "Something went wrong, please try again";
  }
}
