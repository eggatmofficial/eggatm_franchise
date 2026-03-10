const service = require("./billing.service");
const Table = require("../tables/tables.model");
const Staff = require("../auth/auth.model"); // or User model


/* ================= PREVIEW ================= */

exports.preview = async (req, res, next) => {
  try {
    const { tabId } = req.params;

    if (!tabId)
      return res.status(400).json({ message: "tabId missing" });

    const bill = await service.previewBill(String(tabId));

    res.json({ success: true, data: bill });

  } catch (err) {
    next(err);
  }
};


/* ================= GENERATE ================= */

exports.generateBill = async (req, res, next) => {
  try {

    const tabId = String(req.params.tabId);

    console.log("✅ CONTROLLER TABID:", tabId);

    const bill = await service.generateBill({
      user: req.user,
      tabId: tabId,
    customerName: req.body.customerName,
     customerMobile: req.body.customerMobile
    });

    res.json({
      success: true,
      data: bill,
    });

  } catch (err) {
    next(err);
  }
};


/* ================= LIST ================= */

exports.getBills = async (req, res) => {
  try {

    console.log("USER:", req.user);   // ⭐ debug

    const franchiseId = req.user.franchiseId;

    const bills = await service.getBills(franchiseId);

    res.json({
      success: true,
      data: bills
    });

  } catch (err) {
    console.error("GET BILLS ERROR:", err); // ⭐ IMPORTANT
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};






exports.getPrintQueue = async (req,res,next)=>{
  try{
    const bills = await service.getPrintQueue(
      req.user.franchiseId
    );

    res.json({ success:true, data:bills });
  }catch(err){
    next(err);
  }
};

exports.getMyBills = async (req,res,next)=>{
  try {

    const bills = await service.getMyBills(
      req.user.id,
      req.user.franchiseId
    );

    console.log('staff req',req.user.id);
    

    res.json({ success:true, data:bills });

  } catch(err){
    next(err);
  }
};



exports.getPrintableBill = async (req, res, next) => {
  try {

    const bill = await service.getPrintableBill(
      req.params.billId,
      req.user.franchiseId
    );

    res.json({
      success: true,
      data: bill
    });

  } catch (err) {
    next(err);
  }
};



exports.markPrinted = async (req, res, next) => {
  try {

    const bill = await service.markBillPrinted(
      req.params.billId,
      req.user.id
    );

    res.json({
      success: true,
      message: "Bill marked as printed",
      data: bill
    });

  } catch (err) {
    next(err);
  }
};