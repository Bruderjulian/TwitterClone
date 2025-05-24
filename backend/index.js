import express from "express";
import * as SocketIO from "socket.io";
import http from "http";
import cors from "cors";

import logger from "./utils/logger.js";
import db from "./utils/db.js";
import config from "./utils/config.js";

logger.info("Starting the server...");

// Initialize Routes and Middlewares
const app = express();
app.use(cors());
app.use(express.json());

// Initialize Sockets
const server = http.createServer(app);
const io = new SocketIO.Server(server, {
  cors: { origin: "*" },
});

// REST route
app.get("/tweets", (req, res) => {
  const tweets = db
    .prepare("SELECT * FROM tweets ORDER BY timestamp DESC")
    .all();
  res.json(tweets);
});

// WebSocket
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("new-tweet", (tweet) => {
    console.log("New tweet received:", tweet);
    const stmt = db.prepare(
      "INSERT INTO tweets (text, timestamp) VALUES (?, ?)"
    );
    stmt.run(tweet.text, tweet.timestamp);

    io.emit("tweet-posted", tweet); // broadcast to all
  });
});

server.listen(config.port, config.host, () => {
  logger.info("Server running on " + config.host + ":" + config.port);
});
