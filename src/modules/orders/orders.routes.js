const router = require("express").Router();

const controller = require("./orders.controller");
const auth = require("../../common/middleware/auth.middleware");
const authorize = require("../../common/middleware/role.middleware");
const ROLES = require("../../common/constants/roles.constant");

router.post("/",auth,authorize(ROLES.STAFF),controller.create);

router.get("/reports",auth,authorize(ROLES.FRANCHISE),controller.getReports);


module.exports = router;
