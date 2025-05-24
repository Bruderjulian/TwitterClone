import { validatePort, validateHost } from "./validator";
import { resolve } from "path";
import dotenv from "dotenv";
dotenv.config();

export default {
  port: validatePort(process.env.PORT),
  host: validateHost(process.env.HOST),
  logLevel: process.env.LOG_LEVEL || "info",
  db_path: resolve(process.cwd(), process.env.DB_PATH || "./db.sqlite"),
  jwtSecret: process.env.JWT,
};
