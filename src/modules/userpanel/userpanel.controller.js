const Customer = require("../customers/customer.model");
const Franchise = require("../franchise/franchise.model");

/**
 * GET /userpanel/lookup?phone=9876543210
 * Public endpoint — no auth. Customer enters phone to see their loyalty info.
 */
exports.lookupCustomer = async (req, res, next) => {
  try {
    const { phone } = req.query;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    // Normalize: strip spaces/dashes
    const normalized = String(phone).replace(/\D/g, "");

    // Try exact match first, then last-10-digit match
    const customer = await Customer.findOne({
      $or: [
        { phone: normalized },
        { phone: phone.trim() },
      ],
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "No account found for this phone number. Visit Egg! ATM to register.",
      });
    }

    // Get franchise info
    const franchise = customer.franchiseId
      ? await Franchise.findById(customer.franchiseId).select("name city rewardThreshold pointsPerAmount")
      : null;

    // Days since last visit (updatedAt changes on every transaction)
    const lastVisitDate = customer.updatedAt || customer.createdAt;
    const daysSinceLastVisit = lastVisitDate
      ? Math.max(0, Math.floor((Date.now() - new Date(lastVisitDate).getTime()) / (1000 * 60 * 60 * 24)))
      : null;

    const rewardThreshold = franchise?.rewardThreshold ?? 100;
    const pointsToNextReward = customer.rewardEligible
      ? 0
      : Math.max(0, rewardThreshold - (customer.loyaltyPoints || 0));

    return res.json({
      success: true,
      data: {
        name: customer.name || null,
        phone: customer.phone,
        loyaltyPoints: customer.loyaltyPoints || 0,
        rewardEligible: customer.rewardEligible || false,
        rewardsRedeemed: customer.rewardsRedeemed || 0,
        lastVisitDate: lastVisitDate || null,
        daysSinceLastVisit,
        franchise: franchise
          ? {
              name: franchise.name,
              city: franchise.city,
              rewardThreshold,
              pointsPerAmount: franchise.pointsPerAmount,
            }
          : null,
        pointsToNextReward,
      },
    });
  } catch (err) {
    next(err);
  }
};
