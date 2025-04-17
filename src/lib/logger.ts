import winston from "winston";
import type { TransformableInfo } from "logform"; // logform is a Winston dep

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf((info: TransformableInfo) => {
      const { timestamp, level, message } = info;
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      return `${timestamp} [${level.toUpperCase()}] ${message}`;
    })
  ),
  transports: [new winston.transports.Console()],
});
