import winston from "winston";
import type { TransformableInfo } from "logform"; // logform is a Winston dep
import { ENV } from "./env.js";

const format =
  ENV.NODE_ENV === "production"
    ? winston.format.json()
    : winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf((info: TransformableInfo) => {
          const { timestamp, level, message } = info;
          return `${timestamp?.toString() ?? ""} [${level.toUpperCase()}] ${message?.toString() ?? ""}`;
        })
      );

export const logger = winston.createLogger({
  level: "info",
  format,
  transports: [new winston.transports.Console()],
});
