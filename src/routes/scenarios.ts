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

export default router;
