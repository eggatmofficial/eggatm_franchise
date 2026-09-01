const Customer = require("../customers/customer.model");
const Franchise = require("../franchise/franchise.model");
const Feedback = require("../feedback/feedback.model");

/**
 * Helper to format date & time nicely in Indian English standard
 * e.g. "28 Aug 2026, 04:30 PM"
 */
function formatDateTime(dateObj) {
  if (!dateObj) return "—";
  const d = new Date(dateObj);
  if (isNaN(d.getTime())) return "—";

  const dateStr = d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const timeStr = d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${dateStr}, ${timeStr}`;
}

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
      ? await Franchise.findById(customer.franchiseId).select("name city address rewardThreshold pointsPerAmount")
      : null;

    // Last visit date & time (customer.lastVisitDate or updatedAt or createdAt)
    const rawLastVisit = customer.lastVisitDate || customer.updatedAt || customer.createdAt;
    const lastVisitDate = rawLastVisit ? new Date(rawLastVisit) : null;

    let daysSinceLastVisit = null;
    let lastVisitMsg = "Welcome to Egg! ATM";

    if (lastVisitDate) {
      const diffMs = Date.now() - lastVisitDate.getTime();
      daysSinceLastVisit = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

      if (daysSinceLastVisit === 0) {
        lastVisitMsg = "Visited Today! Thanks for dining with us.";
      } else if (daysSinceLastVisit === 1) {
        lastVisitMsg = "Visited Yesterday! Always fresh for you.";
      } else if (daysSinceLastVisit < 30) {
        lastVisitMsg = `Visited ${daysSinceLastVisit} days ago. Visit again soon!`;
      } else {
        lastVisitMsg = `Visited ${daysSinceLastVisit} days ago. We missed you!`;
      }
    }

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
        lastVisitDate: lastVisitDate ? lastVisitDate.toISOString() : null,
        lastVisitFormatted: formatDateTime(lastVisitDate),
        daysSinceLastVisit,
        lastVisitMsg,
        franchise: franchise
          ? {
              name: franchise.name,
              city: franchise.city,
              address: franchise.address || "",
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

/**
 * GET /userpanel/franchises
 * Public endpoint — list active Egg ATM franchise locations
 */
exports.getPublicFranchises = async (req, res, next) => {
  try {
    const franchises = await Franchise.find({ isActive: { $ne: false } }).select(
      "name city address phone rewardThreshold pointsPerAmount"
    );
    return res.json({
      success: true,
      data: franchises,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /userpanel/feedback
 * Public endpoint — customer submits feedback/rating
 */
exports.submitFeedback = async (req, res, next) => {
  try {
    const { phone, customerName, rating, comments, franchiseName } = req.body;

    // Auto-resolve customer name from DB so it's always accurate
    let resolvedName = customerName || "";
    if (phone) {
      const normalized = String(phone).replace(/\D/g, "");
      const customer = await Customer.findOne({
        $or: [{ phone: normalized }, { phone: String(phone).trim() }],
      }).select("name");
      if (customer && customer.name) {
        // Strip auto-generated "ATM-" prefix if present
        resolvedName = customer.name.replace(/^ATM-/i, "").trim();
      }
    }

    const newFeedback = await Feedback.create({
      phone: phone || "Anonymous",
      customerName: resolvedName,
      rating: Number(rating) || 5,
      comments: comments || "",
      franchiseName: franchiseName || "Egg! ATM",
    });

    return res.json({
      success: true,
      message: "Thank you for your feedback! Your review helps us stay fresh.",
      data: newFeedback,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /userpanel/feedbacks
 * Admin endpoint — list all customer feedbacks
 */
exports.getAllFeedbacks = async (req, res, next) => {
  try {
    const list = await Feedback.find().sort({ createdAt: -1 });

    // Enrich records that have no customerName by looking up Customer by phone
    const phones = list
      .filter((f) => !f.customerName && f.phone && f.phone !== "Anonymous")
      .map((f) => f.phone.replace(/\D/g, ""));

    let customerMap = {};
    if (phones.length > 0) {
      const customers = await Customer.find({
        phone: { $in: phones },
      }).select("phone name");
      customers.forEach((c) => {
        const cleanName = c.name ? c.name.replace(/^ATM-/i, "").trim() : "";
        customerMap[c.phone.replace(/\D/g, "")] = cleanName;
      });
    }

    const enriched = list.map((f) => {
      const obj = f.toObject();
      if (!obj.customerName) {
        const key = (obj.phone || "").replace(/\D/g, "");
        obj.customerName = customerMap[key] || "";
      }
      return obj;
    });

    return res.json({
      success: true,
      data: enriched,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /userpanel/feedbacks/:id
 * Admin endpoint — delete a feedback entry
 */
exports.deleteFeedback = async (req, res, next) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    return res.json({
      success: true,
      message: "Feedback deleted",
    });
  } catch (err) {
    next(err);
  }
};
