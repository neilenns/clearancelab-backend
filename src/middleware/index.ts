import express from "express";
import helmet from "helmet";
import errorHandler from "./errorHandler.js";

export default function applyMiddleware(app: express.Express) {
  app.use(helmet());
  app.use(express.json());

  // Always at the end.
  app.use(errorHandler);
}
