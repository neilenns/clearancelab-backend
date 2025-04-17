import express from "express";
import helmet from "helmet";
import errorHandler from "./errorHandler.js";
import { requestLogger } from "./logging.js";

export default function applyMiddleware(app: express.Express) {
  app.use(helmet());
  app.use(express.json());
  app.use(requestLogger);

  // Always at the end.
  app.use(errorHandler);
}
