import express from "express";

const router = express.Router();

router.get("/", function (_req, res) {
  res.json({ status: "success" });
});

export default router;
