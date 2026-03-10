const Franchise = require("../../modules/franchise/franchise.model");

exports.generateFranchiseCode = async () => {

  // find last created franchise
  const last = await Franchise
    .findOne({})
    .sort({ createdAt: -1 });

  if (!last || !last.franchiseCode) {
    return "FRN-0001";
  }

  // extract number
  const lastNumber = parseInt(
    last.franchiseCode.split("-")[1]
  );

  const nextNumber = String(lastNumber + 1)
    .padStart(4, "0");

  return `FRN-${nextNumber}`;
};
