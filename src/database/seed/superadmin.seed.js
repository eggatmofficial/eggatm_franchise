require("../../config/env.config");
const mongoose = require("mongoose");
const connectDB = require("../../config/db.config");

const User = require("../../modules/auth/auth.model");
const { hashPassword } = require("../../modules/auth/auth.helper");
const ROLES = require("../../common/constants/roles.constant");

(async () => {
  await connectDB();

  const exists = await User.findOne({ role: ROLES.SUPERADMIN });

  if (exists) {
    console.log("Superadmin already exists");
    process.exit();
  }

  const password = await hashPassword("Eggatm@123");

  await User.create({
    name: "Super Admin",
    email: "eggatmofficial@gmail.com",
    password,
    role: ROLES.SUPERADMIN,
  });

  console.log("✅ Superadmin created");
  process.exit();
})();
