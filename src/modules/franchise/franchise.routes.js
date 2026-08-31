const router = require("express").Router();

const controller = require("./franchise.controller");
const auth = require("../../common/middleware/auth.middleware");
const authorize = require("../../common/middleware/role.middleware");
const ROLES = require("../../common/constants/roles.constant");


router.post("/",auth,authorize(ROLES.SUPERADMIN),controller.create);

router.get("/",auth,authorize(ROLES.SUPERADMIN),controller.getAll);

/* ===== CRM ROUTES (Admin Dashboard flow) ===== */

// franchise-wise customer count / totals
router.get("/customers/summary", auth, authorize(ROLES.SUPERADMIN), controller.getCustomerStats);

// download excel (all franchises, or ?franchiseId=xxx for one)
router.get("/customers/export", auth, authorize(ROLES.SUPERADMIN), controller.exportCustomers);

router.put("/:id",auth,authorize(ROLES.SUPERADMIN),controller.update);

router.delete("/:id",auth,authorize(ROLES.SUPERADMIN),controller.delete);

router.patch( "/:id/status",auth,authorize(ROLES.SUPERADMIN),controller.toggleStatus);

// editable reward points config for a franchise
router.patch("/:id/rewards-config", auth, authorize(ROLES.SUPERADMIN), controller.updateRewardsConfig);

// phone numbers / customers of one franchise (click franchise -> show phone numbers)
router.get("/:id/customers", auth, authorize(ROLES.SUPERADMIN), controller.getFranchiseCustomers);

router.get("/:id", auth, authorize(ROLES.SUPERADMIN), controller.getById);

module.exports = router;

module.exports = router;
