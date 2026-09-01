const router = require("express").Router();
const controller = require("./userpanel.controller");

// Public route — no auth needed (customer checks own points)
router.get("/lookup", controller.lookupCustomer);

module.exports = router;
