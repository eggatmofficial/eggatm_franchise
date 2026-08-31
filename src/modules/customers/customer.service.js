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

  return {
    customer,
    pointsEarned,
    billAmount: amount
  };
};



/* =====================================================
   ✅ CRM: Add to contact (quick-save, no bill / free field)
===================================================== */
exports.addToContact = async ({ name, phone, franchiseId }) => {

  let customer = await Customer.findOne({ phone });

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

  return Customer.find(query).sort({ createdAt: -1 });
};
