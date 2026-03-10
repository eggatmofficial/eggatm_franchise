const service = require("./customer.service")

exports.getRewardCustomers = async (req,res,next)=>{
  try {

    const franchiseId = req.user.franchiseId;

    const data =
      await service.getRewardsDashboard(franchiseId);

    res.json({
      success:true,
      data
    });

  } catch(err){
    next(err);
  }
};




exports.resetReward = async (req, res, next) => {
  try {

    const { customerId } = req.params;

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: "Customer ID required"
      });
    }

    const customer =
      await service.resetCustomerReward(customerId);

    res.json({
      success: true,
      message: "Reward redeemed successfully",
      data: customer
    });

  } catch (err) {
    next(err);
  }
};



exports.checkCustomer = async (req,res,next)=>{
  try {

    const { mobile } = req.query;

    const customer =
      await service.checkCustomerEligibility(
        mobile,
        req.user.franchiseId
      );

    res.json({ success:true, data:customer });

  } catch(err){
    next(err);
  }
};
