const router = require("express").Router();

const controller = require("./menu.controller");
const auth = require("../../common/middleware/auth.middleware");
const authorize = require("../../common/middleware/role.middleware");
const ROLES = require("../../common/constants/roles.constant");
const upload = require("../../common/middleware/upload.middleware");

router.use(auth);

router.post("/", authorize(ROLES.FRANCHISE),upload.single("image"), controller.create);

router.get("/",authorize(ROLES.FRANCHISE, ROLES.STAFF),controller.getAll);

router.put("/:id", authorize(ROLES.FRANCHISE), upload.single("image"), controller.update);

router.delete("/:id", authorize(ROLES.FRANCHISE), controller.delete);

module.exports = router;
