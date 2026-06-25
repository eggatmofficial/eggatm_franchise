const router = require("express").Router();

const controller = require("./loyalty.controller");


router.post("/check-points",controller.checkPoints);


module.exports = router;
