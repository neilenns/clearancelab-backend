import express from "express";

// Routes
import defaultRouter from "#routes/default.js";
import scenarioRoutes from "#routes/scenarios.js";

/**
 * Registers all application routes with the Express application.
 * @param app Express application instance
 */
export default function addRoutes(app: express.Express) {
  app.use(defaultRouter);
  app.use(scenarioRoutes);
}
