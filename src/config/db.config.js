const mongoose = require("mongoose");
const { MONGO_URI } = require("./env.config");
const logger = require("./logger.config");

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info("MongoDB Connected");
  } catch (err) {
    logger.error("DB Connection Failed", err);
    process.exit(1);
  }
};

module.exports = connectDB;
