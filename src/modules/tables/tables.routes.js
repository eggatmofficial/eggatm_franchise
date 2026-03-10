const router = require("express").Router();

const controller = require("./tables.controller");

const auth = require("../../common/middleware/auth.middleware");
const authorize = require("../../common/middleware/role.middleware");
const ROLES = require("../../common/constants/roles.constant");



router.post("/",auth,authorize(ROLES.FRANCHISE),controller.create);

router.get("/",auth,authorize(ROLES.FRANCHISE, ROLES.STAFF),controller.getAll);

router.put("/:id",auth,authorize(ROLES.FRANCHISE),controller.update);

router.delete("/:id",auth,authorize(ROLES.FRANCHISE),controller.delete);

router.get("/:id", auth, controller.getOne);


module.exports = router;
