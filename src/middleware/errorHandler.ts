import { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (err: Error, _, res, __) => {
  console.error(err.stack);

  // Hide details in production
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal Server Error"
      : err.message;

  res.status(res.statusCode).json({
    success: false,
    status: res.statusCode,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
