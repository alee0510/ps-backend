import { createLogger, format, transports } from "winston";
import env from "@/env";

// create logger
export const Logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.json(), // serialize the log object to JSON
    format.errors({ stack: env.NODE_ENV === "production" ? false : true }), // include stack traces for errors
    // format.prettyPrint(), // make the log more readable
    // format.printf((info) => {
    //   return `${info.timestamp} ${info.level}: ${info.message}`;
    // }),
  ),
  defaultMeta: { service: "express-api" },
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/app.log" }),
  ],
});
