const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const zooRoute = require("./routes/zooRoute");

const server = express();

server.use(express.json());
server.use(cors());
server.use(helmet());
server.use(morgan("dev"));
server.use("/api/zoos", zooRoute);

server.get("/", async (req, res, next) => {
  res.send(`<h2>Lambda Zoo API</h2>`);
});

module.exports = server;
