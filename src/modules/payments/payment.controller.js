const service = require("./payment.service");

/* ================= CREATE REQUEST ================= */
exports.create = async (req, res, next) => {
  try {

    const data = await service.createRequest(
      req.user,
      req.body
    );

    res.json({
      success: true,
      data,
    });

  } catch (err) {
    next(err);
  }
};


/* ================= GET BILLING QUEUE ================= */
exports.getPending = async (req, res, next) => {
  try {

    const data = await service.getPendingRequests();

    res.json({
      success: true,
      data,
    });

  } catch (err) {
    next(err);
  }
};


/* ================= COMPLETE PAYMENT ================= */
exports.pay = async (req, res, next) => {
  try {

    const { method } = req.body;

    const data = await service.completePayment(
      req.user,
      req.params.id,
      method
    );

    res.json({
      success: true,
      data,
    });

  } catch (err) {
    next(err);
  }
};



/* ================= PROCEED PAYMENT ================= */
exports.proceed = async (req,res,next)=>{
  try{

    const { tabId, method } = req.body;

    const data = await service.proceedPayment(
      req.user,
      tabId,
      method
    );

    res.json({
      success:true,
      data
    });

  }catch(err){
    next(err);
  }
};
