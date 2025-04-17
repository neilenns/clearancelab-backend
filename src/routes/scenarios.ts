import { Router, Request, Response, NextFunction } from "express";
import { ScenarioModel } from "../models/scenario.js";
import { verifyApiKey } from "../middleware/apikey.js";

const router = Router();

router.get(
  "/scenarios",
  verifyApiKey,
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const scenarios = await ScenarioModel.findAll();
      res.json(scenarios);
    } catch (err) {
      next(err); // Pass to centralized error handler
    }
  }
);

// Add a route to look up a scenario by ID
router.get(
  "/scenarios/:id",
  verifyApiKey,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const scenario = await ScenarioModel.findScenarioById(id);

      if (!scenario) {
        res.status(404).json({ error: "Scenario not found" });
        return;
      }

      res.json(scenario);
    } catch (err) {
      next(err); // Pass to centralized error handler
    }
  }
);

export default router;
