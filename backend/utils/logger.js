import winston from "winston";

const { combine, timestamp, printf, errors, prettyPrint, colorize } =
  winston.format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `[${timestamp}] ${level}: ${stack || message}`;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    prettyPrint(),
    timestamp({
      format: "MM-DD hh:mm",
    }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      format: combine(
        prettyPrint(),
        colorize({ all: true }),
        timestamp({
          format: "MM-DD hh:mm",
        }),
        errors({ stack: true }),
        logFormat
      ),
    }),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
  exitOnError: false,
});

export default logger;
