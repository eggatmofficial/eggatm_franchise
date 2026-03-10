const router = require("express").Router();

const controller = require("./payment.controller");
const auth = require("../../common/middleware/auth.middleware");

/* ================= CREATE PAYMENT REQUEST (STAFF) ================= */
router.post("/", auth, controller.create);

/* ================= BILLING QUEUE (FRANCHISE) ================= */
router.get("/", auth, controller.getPending);

/* ================= COMPLETE PAYMENT ================= */
router.patch("/:id/pay", auth, controller.pay);

router.post("/proceed", auth, controller.proceed);

module.exports = router;
