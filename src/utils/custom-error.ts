export class CustomError extends Error {
  status: number;
  details: string;

  constructor(status: number, message: string, err?: string) {
    super(message);
    this.status = status;
    this.details = err || "Something went wrong, please try again";
  }
}
