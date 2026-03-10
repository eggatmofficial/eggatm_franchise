const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./routes/index.routes");
const errorMiddleware = require("./common/middleware/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use("/api", routes);

app.use(errorMiddleware);

module.exports = app;
