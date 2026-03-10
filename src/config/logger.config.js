const fs = require("fs");
const path = require("path");
const { createLogger, format, transports } = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");

const logDir = path.join(__dirname, "../../logs");

// create logs folder automatically
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.printf(({ level, message, timestamp }) =>
      `${timestamp} [${level}] : ${message}`
    )
  ),
  transports: [
    new DailyRotateFile({
      filename: path.join(logDir, "app-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxFiles: "7d", // logs auto delete after 7 days
      zippedArchive: true
    })
  ]
});

// show console logs only in development
if (process.env.NODE_ENV !== "production") {
  logger.add(new transports.Console());
}

module.exports = logger;