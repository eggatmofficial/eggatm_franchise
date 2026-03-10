const service = require("./dashboard.service");

exports.staffDashboard = async (req, res, next) => {
  try {

    const data = await service.getStaffDashboard(req.user);

    console.log("data",data);
    

    res.json({
      success: true,
      data
    });

  } catch (err) {
    next(err);
  }
};




// exports.franchiseDashboard = async (req,res,next)=>{
//   try{

//     const type = req.query.type || "daily";

//     const data = await service.getFranchiseDashboard(
//       req.user.franchiseId,
//       type
//     );

//     res.json({
//       success:true,
//       data
//     });

//   }catch(err){
//     next(err);
//   }
// };



exports.getFranchiseDashboard = async (req,res,next)=>{

 try{

  const franchiseId = req.user.franchiseId

  const data = await service.getFranchiseDashboard(
   franchiseId,
   req.query
  )

  res.json({
   success:true,
   data
  })

 }catch(err){
  next(err)
 }

}



exports.getSuperAdminDashboard = async (req, res, next) => {
  try {

    const data = await service.getSuperAdminDashboard(req.query);

    res.json({
      success: true,
      data
    });

  } catch (err) {
    next(err);
  }
};


