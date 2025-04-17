import { type NextFunction, type Request, type Response } from "express";
import { ApiKeyModel } from "../models/apiKey.js";

// Verifies that a valid api key was provided in the web request. This gets
// used on all routes on the server.
export const verifyApiKey = async function (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Get the API key from the request headers
    const apiKey = req.headers["x-api-key"] ?? req.query["x-api-key"];

    if (typeof apiKey !== "string") {
      res.status(401).json({ error: "Unauthorized - Invalid API key format" });
      return;
    }

    const apiKeyDoc = await ApiKeyModel.findOne({
      _id: apiKey,
      isActive: true,
    });

    if (apiKeyDoc == null) {
      console.error(`Invalid API key: ${apiKey}`);
      res.status(401).json({ error: "Unauthorized - Invalid API key" });
      return;
    }
  } catch (err) {
    const error = err as Error;

    console.error(`Unable to verify API key: ${error.message}`, error);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }

  next();
};
