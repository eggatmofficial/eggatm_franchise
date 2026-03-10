const router = require("express").Router();

const controller = require("./staff.controller");
const auth = require("../../common/middleware/auth.middleware");
const authorize = require("../../common/middleware/role.middleware");
const ROLES = require("../../common/constants/roles.constant");


router.post("/",auth,authorize(ROLES.FRANCHISE),controller.create);

router.get("/",auth, authorize(ROLES.FRANCHISE), controller.getAll);

router.put("/:id",auth, authorize(ROLES.FRANCHISE),controller.update);

router.delete("/:id",auth,authorize(ROLES.FRANCHISE),controller.delete);

module.exports = router;
