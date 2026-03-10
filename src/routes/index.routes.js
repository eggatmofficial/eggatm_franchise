const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// ✅ correct path
const modulesPath = path.join(__dirname, "../modules");

router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API running",
  });
});

/*
   Auto load module routes
*/
fs.readdirSync(modulesPath).forEach((moduleName) => {

  const moduleDir = path.join(modulesPath, moduleName);

  if (!fs.statSync(moduleDir).isDirectory()) return;

  const routeFile = fs
    .readdirSync(moduleDir)
    .find((file) => file.endsWith(".routes.js"));

  if (!routeFile) return;

  const routePath = path.join(moduleDir, routeFile);
  const routeHandler = require(routePath);

  // ✅ ensure express router
  if (!routeHandler || typeof routeHandler.use !== "function") {
    console.error(`❌ ${moduleName}: ${routeFile} does not export router`);
    return;
  }

  router.use(`/${moduleName}`, routeHandler);

});

module.exports = router;
