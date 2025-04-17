import express from "express";
import errorHandler from "./errorHandler";
import helmet from "helmet";

export default function applyMiddleware(app: express.Express) {
  app.use(errorHandler);
  app.use(helmet());
  app.use(express.json());
}
