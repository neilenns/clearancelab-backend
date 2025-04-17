import { ScenarioModel } from "../models/scenario";
import express from "express";

const router = express.Router();

router.get("/scenarios", async (_req, res, next) => {
  try {
    const scenarios = await ScenarioModel.findAll();
    res.json(scenarios);
  } catch (err) {
    next(err); // Pass to centralized error handler
  }
});

export default router;
