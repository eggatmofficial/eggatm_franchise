const router = require("express").Router();
const controller = require("./customer.controller");
const auth = require("../../common/middleware/auth.middleware");
const authorize = require("../../common/middleware/role.middleware");
const ROLES = require("../../common/constants/roles.constant");


router.get("/rewards", auth, authorize(ROLES.FRANCHISE), controller.getRewardCustomers);

router.patch("/rewards/reset/:customerId",auth,authorize(ROLES.FRANCHISE),controller.resetReward);

router.get( "/check", auth, authorize(ROLES.FRANCHISE, ROLES.STAFF), controller.checkCustomer);

/* =====================================================
   ✅ CRM PANEL (Franchise Owner / Sub Admin flow)
===================================================== */

// Add button -> customer phone + bill amount -> awards loyalty points
router.post("/", auth, authorize(ROLES.FRANCHISE), controller.addCustomerPurchase);

// Add to contact -> save customer (phone/name) with no bill, free field
router.post("/contact", auth, authorize(ROLES.FRANCHISE), controller.addToContact);

// View button -> list of this franchise's customers
router.get("/", auth, authorize(ROLES.FRANCHISE), controller.listCustomers);


module.exports = router;
