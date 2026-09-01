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

// Direct campaign message dispatch to selected customers
router.post("/campaign/send", auth, authorize(ROLES.FRANCHISE), controller.sendCampaign);

/* =====================================================
   ✅ ADMIN: All customers across all franchises
===================================================== */
router.get("/all", auth, authorize(ROLES.SUPERADMIN), controller.listAllCustomersForAdmin);

// View button -> list of this franchise's customers
router.get("/", auth, authorize(ROLES.FRANCHISE), controller.listCustomers);

router.put("/:id", auth, authorize(ROLES.FRANCHISE, ROLES.SUPERADMIN), controller.updateCustomer);
router.delete("/:id", auth, authorize(ROLES.FRANCHISE, ROLES.SUPERADMIN), controller.deleteCustomer);
router.patch("/:id/status", auth, authorize(ROLES.FRANCHISE, ROLES.SUPERADMIN), controller.toggleCustomerStatus);

module.exports = router;
