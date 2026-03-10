const router = require("express").Router();
const controller = require("./billing.controller");
const auth = require("../../common/middleware/auth.middleware");

/* BILL PREVIEW */
router.get("/preview/:tabId", controller.preview);

/* GENERATE BILL */
router.post("/generate/:tabId", auth, controller.generateBill);

/* LIST */
router.get("/", auth, controller.getBills);

router.get("/print-queue", auth, controller.getPrintQueue);

router.get("/my", auth, controller.getMyBills);

/* PRINT BILL DATA */
router.get("/print/:billId",auth,controller.getPrintableBill);

/* UPDATE PRINT STATUS */
router.patch("/printed/:billId",auth,controller.markPrinted);

module.exports = router;
