const router = require("express").Router();

const controller = require("./session.controller");
const auth = require("../../common/middleware/auth.middleware");
const authorize = require("../../common/middleware/role.middleware");
const ROLES = require("../../common/constants/roles.constant");

router.use(auth);

/* START DINING */
router.post("/start",authorize(ROLES.FRANCHISE, ROLES.STAFF),controller.start);

/* GET ACTIVE SESSION BY TABLE */
router.get("/table/:tableId", authorize(ROLES.FRANCHISE, ROLES.STAFF),controller.getActive);

/* CLOSE SESSION */
router.patch("/close/:id",authorize(ROLES.FRANCHISE),controller.close);

module.exports = router;
