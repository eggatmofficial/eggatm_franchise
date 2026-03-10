const service = require("./profit.service");

exports.getProfit = async (req,res,next)=>{
  try {

    const data = await service.getProfitReport(
      req.user.franchiseId
    );

    res.json({ success:true, data });

  } catch(err){
    next(err);
  }
};
