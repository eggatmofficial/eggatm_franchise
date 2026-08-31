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



/* =====================================================
   ✅ CRM: Add customer purchase (phone + bill amount)
   -> Add / Submit -> "points added successfully"
===================================================== */

exports.addCustomerPurchase = async (req, res, next) => {
  try {

    const { name, phone, billAmount } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Customer phone number is required"
      });
    }

    const result = await service.addCustomerPurchase({
      name,
      phone,
      billAmount,
      franchiseId: req.user.franchiseId
    });

    res.json({
      success: true,
      message: "Points added successfully",
      data: result
    });

  } catch (err) {
    next(err);
  }
};



/* =====================================================
   ✅ CRM: Add to contact (save customer, free field, no bill)
===================================================== */

exports.addToContact = async (req, res, next) => {
  try {

    const { name, phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Customer phone number is required"
      });
    }

    const customer = await service.addToContact({
      name,
      phone,
      franchiseId: req.user.franchiseId
    });

    res.json({
      success: true,
      message: "Customer saved to contacts",
      data: customer
    });

  } catch (err) {
    next(err);
  }
};



/* =====================================================
   ✅ CRM: View -> list customers of this franchise
===================================================== */

exports.listCustomers = async (req, res, next) => {
  try {

    const customers = await service.listCustomers(
      req.user.franchiseId,
      req.query.search,
      req.query.contactsOnly === "true"
    );

    res.json({ success: true, data: customers });

  } catch (err) {
    next(err);
  }
};
