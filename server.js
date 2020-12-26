const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./src/routes");
const { createRedisConnection } = require("./src/controllers/redis.controller");
const PORT = process.env.PORT || 3001;

let app = express();

app.use(cors());

const server = require("http").Server(app);

app.use(morgan("tiny"));
app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(routes);

// app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`server running at port ${PORT}`);
});

createRedisConnection()

module.exports = { app };
