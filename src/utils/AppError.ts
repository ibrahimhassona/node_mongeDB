export class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;

  constructor(messages: string, statusCode: number) {
    super(messages);



    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;


    
    Error.captureStackTrace(this, this.constructor);
  }
}
