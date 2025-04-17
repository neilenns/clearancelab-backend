import { NextFunction, Request, Response, Router } from "express";
import { verifyApiKey } from "../middleware/apikey.js";
import { ScenarioModel } from "../models/scenario.js";

const router = Router();

interface ScenarioQuery {
  summary?: string;
}

router.get(
  "/",
  verifyApiKey,
  async (
    req: Request<unknown, unknown, unknown, ScenarioQuery>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const summary = req.query.summary === "true";

      // Get partial data if summary was requested.
      const projection = summary
        ? { title: 1, isValid: 1, "plan.dep": 1, "plan.dest": 1, "plan.aid": 1 }
        : undefined;

      const scenarios = await ScenarioModel.find({}, projection).lean();

      res.json(scenarios);
    } catch (err) {
      next(err);
    }
  }
);

// Add a route to look up a scenario by ID
router.get(
  "/:id",
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
