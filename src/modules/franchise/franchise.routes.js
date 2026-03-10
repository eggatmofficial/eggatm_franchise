const router = require("express").Router();

const controller = require("./franchise.controller");
const auth = require("../../common/middleware/auth.middleware");
const authorize = require("../../common/middleware/role.middleware");
const ROLES = require("../../common/constants/roles.constant");


router.post("/",auth,authorize(ROLES.SUPERADMIN),controller.create);

router.get("/",auth,authorize(ROLES.SUPERADMIN),controller.getAll);

router.put("/:id",auth,authorize(ROLES.SUPERADMIN),controller.update);

router.delete("/:id",auth,authorize(ROLES.SUPERADMIN),controller.delete);

router.patch( "/:id/status",auth,authorize(ROLES.SUPERADMIN),controller.toggleStatus);

router.get("/:id", auth, authorize(ROLES.SUPERADMIN), controller.getById);

module.exports = router;

module.exports = router;
