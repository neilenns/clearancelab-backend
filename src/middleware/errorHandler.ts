import type { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (err: Error, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
};

export default errorHandler;
