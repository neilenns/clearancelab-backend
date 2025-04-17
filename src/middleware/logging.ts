import expressWinston from "express-winston";
import { logger } from "../lib/logger.js";

// Request logger middleware
export const requestLogger = expressWinston.logger({
  winstonInstance: logger,
  meta: false,
  msg: "{{req.method}} {{req.url}}",
  expressFormat: true,
  colorize: true,
});
