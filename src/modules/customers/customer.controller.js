const service = require("./customer.service")
const Franchise = require("../franchise/franchise.model")
const Customer = require("./customer.model")


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



/* =====================================================
   ✅ ADMIN: List all customers across all franchises
   with Franchise Name and Code
===================================================== */

exports.listAllCustomersForAdmin = async (req, res, next) => {
  try {
    const { search, franchiseId } = req.query;

    const query = {};
    if (franchiseId) {
      query.franchiseId = franchiseId;
    }

    if (search) {
      query.$or = [
        { phone: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } }
      ];
    }

    const customers = await Customer.find(query).sort({ createdAt: -1 });
    const franchises = await Franchise.find().lean();

    const franchiseMap = {};
    franchises.forEach((f) => {
      franchiseMap[f._id] = f;
    });

    const enrichedCustomers = customers.map((c) => {
      const doc = c.toObject();
      const f = franchiseMap[doc.franchiseId];
      return {
        ...doc,
        franchiseName: f?.name || "Unknown Franchise",
        franchiseCode: f?.franchiseCode || "—",
        franchiseCity: f?.city || "—"
      };
    });

    const totalCustomers = customers.length;

    res.json({
      success: true,
      data: {
        customers: enrichedCustomers,
        franchises: franchises.map((f) => ({
          _id: f._id,
          name: f.name,
          franchiseCode: f.franchiseCode
        })),
        stats: {
          totalCustomers,
          totalFranchises: franchises.length
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, phone } = req.body;
    
    let customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }
    
    // Check if phone is being changed and if it already exists
    if (phone && phone !== customer.phone) {
      const existing = await Customer.findOne({ phone });
      if (existing) {
        return res.status(400).json({ success: false, message: "Phone number already exists" });
      }
    }
    
    if (name !== undefined) customer.name = name;
    if (phone !== undefined) customer.phone = phone;
    
    await customer.save();
    
    res.json({ success: true, message: "Customer updated successfully", data: customer });
  } catch (err) {
    next(err);
  }
};

exports.deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }
    res.json({ success: true, message: "Customer deleted successfully" });
  } catch (err) {
    next(err);
  }
};

exports.toggleCustomerStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }
    
    customer.isActive = !customer.isActive;
    await customer.save();
    
    res.json({ success: true, message: "Customer status toggled", data: customer });
  } catch (err) {
    next(err);
  }
};

exports.sendCampaign = async (req, res, next) => {
  try {
    const { customerIds, messageTemplate } = req.body;
    const franchiseId = req.user.franchiseId;

    const result = await service.sendCampaign({
      customerIds,
      messageTemplate,
      franchiseId
    });

    res.json({
      success: true,
      message: `Direct campaign sent to ${result.sentCount} customers`,
      data: result
    });
  } catch (err) {
    next(err);
  }
};
