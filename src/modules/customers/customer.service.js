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
