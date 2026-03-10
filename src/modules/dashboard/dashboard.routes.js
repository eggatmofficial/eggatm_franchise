const router = require("express").Router();
const controller = require("./dashboard.controller");
const auth = require("../../common/middleware/auth.middleware");
const authorize = require("../../common/middleware/role.middleware");
const ROLES = require("../../common/constants/roles.constant");


router.get("/staff", auth, controller.staffDashboard);

router.get("/franchise",auth,authorize(ROLES.FRANCHISE),controller.getFranchiseDashboard);

router.get("/superadmin",auth,authorize(ROLES.SUPERADMIN),controller.getSuperAdminDashboard);

module.exports = router;
