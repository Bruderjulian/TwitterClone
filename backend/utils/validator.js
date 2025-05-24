import logger from "./logger";

export function validatePort(port) {
  const parsedPort = parseInt(port, 10);
  if (isNaN(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
    logger.warn("Invalid port number! Using default port '3000'");
    return 3000;
  }
  return parsedPort;
}

export function validateHost(host) {
  if (typeof host !== "string" || host.trim() === "") {
    logger.warn("Invalid host! Using default host 'localhost'");
    return "localhost";
  }
  return host;
}

export function isObject(obj) {
  return typeof obj === "object" && !Array.isArray(obj) && obj !== null;
}
