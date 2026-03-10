const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config/env.config");

exports.hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

exports.comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

exports.generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      franchiseId: user.franchiseId,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};
