const service = require("./orders.service");
const Bill = require("../billing/billing.model");
const Table = require("../tables/tables.model");

exports.create = async (req, res) => {

  console.log("BODY =>", req.body);

  const order = await service.create(
    req.user,     // arg1
    req.body      // arg2
  );

  console.log("req user",req.user);
  

  res.json({
    success: true,
    data: order,
  });
};



exports.getReports = async (
  franchiseId,
  type,
  page = 1,
  limit = 10
) => {

  const now = new Date();
  let startDate;

  if (type === "today") {
    startDate = new Date();
    startDate.setHours(0,0,0,0);
  }
  else if (type === "weekly") {
    startDate = new Date(now.setDate(now.getDate()-7));
  }
  else if (type === "monthly") {
    startDate = new Date(now.setMonth(now.getMonth()-1));
  }

  const skip = (page - 1) * limit;

  /* ================= BILL QUERY ================= */

  const bills = await Bill.aggregate([
    {
      $match:{
        franchiseId,
        status:"paid",
        createdAt:{ $gte:startDate }
      }
    },

    {
      $lookup:{
        from:"tables",
        localField:"tableId",
        foreignField:"_id",
        as:"table"
      }
    },

    {
      $unwind:{
        path:"$table",
        preserveNullAndEmptyArrays:true
      }
    },

    {
      $project:{
        _id:1,
        billNumber:1,
        totalAmount:1,
        createdAt:1,
        items:1,
        tableNumber:"$table.tableNumber"
      }
    },

    { $sort:{ createdAt:-1 } },
    { $skip:skip },
    { $limit:limit }
  ]);

  /* ================= SUMMARY ================= */

  const allBills = await Bill.find({
    franchiseId,
    status:"paid",
    createdAt:{ $gte:startDate }
  });

  const totalSales = allBills.reduce(
    (s,b)=> s + b.totalAmount,0
  );

  const totalBills = allBills.length;

  const totalItemsSold = allBills.reduce(
    (sum,bill)=>
      sum + bill.items.reduce((q,i)=>q+i.qty,0),
    0
  );

  let totalCost = 0;

allOrders.forEach(order => {
  order.items.forEach(item => {
    totalCost += item.costPrice * item.qty;
  });
});

const profit = totalSales - totalCost;


  const totalCount = await Bill.countDocuments({
    franchiseId,
    status:"paid",
    createdAt:{ $gte:startDate }
  });

  return {
    summary:{
      totalSales,
      totalBills,
      totalItemsSold,
      totalSales,
      profit
    },
    pagination:{
      page,
      limit,
      totalPages: Math.ceil(totalCount/limit)
    },
    orders:bills
  };
};
