const Customer = require("../customers/customer.model");

exports.checkPoints = async (body) => {
  const { mobileNumber } = body;

  if (!mobileNumber) {
    throw new Error("Mobile number is required");
  }

  const customer = await Customer.findOne({
    phone: mobileNumber,
  });

  console.log(customer);

  if (!customer) {
    throw new Error("Customer not found");
  }

  return {
    customerId: customer._id,
    name: customer.name,
    phone: customer.phone,
    loyaltyPoints: customer.loyaltyPoints || 0,
    rewardEligible: customer.rewardEligible || false,
  };
};