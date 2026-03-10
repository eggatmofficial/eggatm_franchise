const router = require("express").Router();
const controller = require("./profit.controller");
const auth = require("../../common/middleware/auth.middleware");

router.get("/", auth, controller.getProfit);

module.exports = router;
