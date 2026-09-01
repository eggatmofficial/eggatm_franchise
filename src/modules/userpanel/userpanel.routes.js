const router = require("express").Router();
const controller = require("./userpanel.controller");

// Public routes — customer panel
router.get("/lookup", controller.lookupCustomer);
router.get("/franchises", controller.getPublicFranchises);
router.post("/feedback", controller.submitFeedback);

// Admin routes — customer feedbacks
router.get("/feedbacks", controller.getAllFeedbacks);
router.delete("/feedbacks/:id", controller.deleteFeedback);

module.exports = router;
