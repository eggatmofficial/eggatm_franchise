const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dns = require("dns");
const routes = require("./routes/index.routes");
const errorMiddleware = require("./common/middleware/error.middleware");

dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();

app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "EggATM Franchise API is running 🚀"
  });
});


app.use("/api", routes);

app.use(errorMiddleware);

module.exports = app;
