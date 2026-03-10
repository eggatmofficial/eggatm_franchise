const router = require("express").Router();
const controller = require("./customer.controller");
const auth = require("../../common/middleware/auth.middleware");
const authorize = require("../../common/middleware/role.middleware");
const ROLES = require("../../common/constants/roles.constant");


router.get("/rewards", auth, authorize(ROLES.FRANCHISE), controller.getRewardCustomers);

router.patch("/rewards/reset/:customerId",auth,authorize(ROLES.FRANCHISE),controller.resetReward);

router.get( "/check", auth, authorize(ROLES.FRANCHISE, ROLES.STAFF), controller.checkCustomer);


module.exports = router;
