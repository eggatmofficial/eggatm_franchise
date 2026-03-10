const router = require("express").Router();

const controller = require("./guestTabs.controller");

const auth = require("../../common/middleware/auth.middleware");
const authorize = require("../../common/middleware/role.middleware");
const ROLES = require("../../common/constants/roles.constant");

/* ALL ROUTES REQUIRE LOGIN */
router.use(auth);

/* CREATE TAB (STAFF) */
router.post( "/", authorize(ROLES.STAFF), controller.create);

/* GET TABS BY SESSION */
router.get( "/session/:sessionId",authorize(ROLES.STAFF, ROLES.FRANCHISE),controller.getBySession);

/* PAY TAB */
router.patch("/:id/pay",authorize(ROLES.STAFF),controller.payTab);

/* DELETE TAB */
router.delete("/:id",authorize(ROLES.STAFF),controller.remove);

module.exports = router;
