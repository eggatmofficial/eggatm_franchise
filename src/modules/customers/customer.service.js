const Customer = require("./customer.model");
const Franchise = require("../franchise/franchise.model");

exports.getRewardsDashboard = async (franchiseId) => {

  const match = franchiseId ? { franchiseId } : {};

  // ✅ Total points per franchise
  const franchiseTotals = await Customer.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$franchiseId",
        totalPoints: { $sum: "$loyaltyPoints" },
        totalCustomers: { $sum: 1 }
      }
    }
  ]);

  // ✅ Top customers
  const topCustomers = await Customer.find(match)
    .sort({ loyaltyPoints: -1 })
    .limit(10);

  // ✅ Chart data
  const chartData = await Customer.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$franchiseId",
        points: { $sum: "$loyaltyPoints" }
      }
    }
  ]);

  const franchises = await Franchise.find();

  return {
    franchiseTotals,
    topCustomers,
    chartData,
    franchises
  };
};




exports.resetCustomerReward = async (customerId) => {

  const customer = await Customer.findById(customerId);

  if (!customer)
    throw new Error("Customer not found");

  /* ✅ Reset loyalty */
  customer.loyaltyPoints = 0;
  customer.rewardEligible = false;

  /* ✅ Increase redeemed counter */
  customer.rewardsRedeemed =
    (customer.rewardsRedeemed || 0) + 1;

  await customer.save();

  return customer;
};


exports.checkCustomerEligibility = async (
  mobile,
  franchiseId
) => {

  const customer = await Customer.findOne({
    phone: mobile,
    franchiseId
  });

  if (!customer) return null;

  return {
    _id: customer._id,
    name: customer.name,
    phone: customer.phone,
    loyaltyPoints: customer.loyaltyPoints,
    rewardEligible: customer.rewardEligible
  };
};



/* =====================================================
   ✅ CRM: Add customer purchase -> awards loyalty points
   pointsEarned = floor(billAmount / franchise.pointsPerAmount)
===================================================== */

exports.addCustomerPurchase = async ({
  name,
  phone,
  billAmount,
  franchiseId
}) => {

  const franchise = await Franchise.findById(franchiseId);

  if (!franchise) {
    throw new Error("Franchise not found");
  }

  const rate = franchise.pointsPerAmount || 20;
  const amount = Number(billAmount) || 0;
  const pointsEarned = Math.floor(amount / rate);

  let customer = await Customer.findOne({ phone });
  // Ensure the phone belongs to the same franchise; otherwise reject
  if (customer && customer.franchiseId && customer.franchiseId.toString() !== franchiseId.toString()) {
    throw new Error('Phone number already registered under a different franchise');
  }

  if (!customer) {
    customer = await Customer.create({
      name: name || "Customer",
      phone,
      franchiseId,
      loyaltyPoints: 0
    });
  }

  customer.loyaltyPoints = (customer.loyaltyPoints || 0) + pointsEarned;

  const threshold = franchise.rewardThreshold || 100;
  customer.rewardEligible = customer.loyaltyPoints >= threshold;

  if (name && !customer.name) {
    customer.name = name;
  }

  await customer.save();

  // Return enriched data including franchise name for UI
  return {
    customer,
    pointsEarned,
    billAmount: amount,
    franchiseName: franchise.name || ""
  };
};


/* =====================================================
   ✅ CRM: Add to contact (quick-save, no bill / free field)
===================================================== */
exports.addToContact = async ({ name, phone, franchiseId }) => {

  let customer = await Customer.findOne({ phone });
  // Ensure the phone belongs to the same franchise; otherwise reject
  if (customer && customer.franchiseId && customer.franchiseId.toString() !== franchiseId.toString()) {
    throw new Error('Phone number already registered under a different franchise');
  }

  if (customer) {
    let changed = false;

    if (name && !customer.name) {
      customer.name = name;
      changed = true;
    }

    if (!customer.isContact) {
      customer.isContact = true;
      changed = true;
    }

    if (changed) {
      await customer.save();
    }

    return customer;
  }

  customer = await Customer.create({
    name: name || "",
    phone,
    franchiseId,
    loyaltyPoints: 0,
    isContact: true
  });

  return customer;
};



/* =====================================================
   ✅ CRM: View -> list this franchise's customers
===================================================== */

exports.listCustomers = async (franchiseId, search, contactsOnly) => {

  const query = { franchiseId };

  if (contactsOnly) {
    query.isContact = true;
  }

  if (search) {
    query.$or = [
      { phone: { $regex: search, $options: "i" } },
      { name: { $regex: search, $options: "i" } }
    ];
  }

  const customers = await Customer.find(query)
    .populate('franchiseId', 'name')
    .sort({ createdAt: -1 })
    .lean();
  // Attach franchiseName for front‑end convenience
  const enriched = customers.map(c => ({
    ...c,
    franchiseName: c.franchiseId?.name || ''
  }));
  return enriched;
};

exports.getCustomerById = async (customerId) => {
  return Customer.findById(customerId);
};

exports.sendCampaign = async ({ customerIds, messageTemplate, franchiseId }) => {
  if (!customerIds || !Array.isArray(customerIds) || customerIds.length === 0) {
    throw new Error("No customer IDs provided");
  }

  const franchise = await Franchise.findById(franchiseId).lean();
  const fName = franchise?.name || "Main Branch";
  const fPhone = franchise?.phone || "";

  const customers = await Customer.find({
    _id: { $in: customerIds },
    franchiseId
  }).lean();

  const results = customers.map(customer => {
    const name = customer.name ? customer.name.replace(/^ATM-/, "").trim() : "Customer";
    const points = customer.loyaltyPoints ?? 0;

    let formattedMsg = (messageTemplate || "")
      .replace(/\{\{\s*Customer Name\s*\}\}/gi, name)
      .replace(/\{\{\s*Franchise Name\s*\}\}/gi, fName)
      .replace(/\{\{\s*Franchise Phone\s*\}\}/gi, fPhone)
      .replace(/\{\{\s*Total Points\s*\}\}/gi, String(points));

    return {
      customerId: customer._id,
      phone: customer.phone,
      name: customer.name,
      message: formattedMsg,
      status: "sent",
      sentAt: new Date()
    };
  });

  return {
    sentCount: results.length,
    sentIds: results.map(r => r.customerId),
    results
  };
};

