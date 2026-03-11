const Order = require("../orders/orders.model");
const GuestTab = require("../guestTabs/guestTabs.model");
const Session = require("../sessions/session.model");
const Franchise = require("../franchise/franchise.model")
const Bill = require("../billing/billing.model");


exports.getStaffDashboard = async (user) => {

  const staffId = user.id;

  // ⭐ start of today
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  /* ================= ORDERS CREATED TODAY ================= */

  const ordersToday = await Order.countDocuments({
    createdBy: staffId,
    createdAt: { $gte: todayStart }
  });

  /* ================= SALES (FROM PAID BILLS) ================= */

  const salesAgg = await Bill.aggregate([
    {
      $match: {
        generatedBy: staffId,      // UUID string match
        paymentStatus: "paid",
        createdAt: { $gte: todayStart }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$totalAmount" }
      }
    }
  ]);

  const salesHandled = salesAgg[0]?.total || 0;

  /* ================= GUESTS SERVED =================
     1 PAID BILL = 1 GUEST SERVED
  ==================================================== */

  const guestsServed = await Bill.countDocuments({
    generatedBy: staffId,
    paymentStatus: "paid",
    createdAt: { $gte: todayStart }
  });

  /* ================= ACTIVE TABLES ================= */

  const activeTables = await Session.countDocuments({
    staffId: staffId,
    status: "active"
  });

  /* ================= FINAL RESPONSE ================= */

  return {
    activeTables,
    ordersToday,
    guestsServed,
    salesHandled
  };
};


const {
  getTodayRange,
  getYesterdayRange
} = require("../../../src/common/utils/timeHelper")

exports.getFranchiseDashboard = async (franchiseId, query) => {

  const now = new Date()

  let startDate
  let endDate

  const today = getTodayRange()
  const yesterday = getYesterdayRange()

  /* CUSTOM DATE */

  if (query.startDate && query.endDate) {

    startDate = new Date(query.startDate)
    endDate = new Date(query.endDate)
    endDate.setHours(23,59,59,999)

  }

  /* YEAR FILTER (ex: ?year=2024) */

  else if (query.year) {

    const year = parseInt(query.year)

    startDate = new Date(year,0,1)
    endDate = new Date(year,11,31,23,59,59)

  }

  /* TYPE FILTER */

  else {

    const type = query.type || "today"

    if (type === "today") {
      startDate = today.start
      endDate = today.end
    }

    else if (type === "yesterday") {
      startDate = yesterday.start
      endDate = yesterday.end
    }

    else if (type === "monthly") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      endDate = now
    }

    else if (type === "yearly") {
      startDate = new Date(now.getFullYear(), 0, 1)
      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59)
    }

  }

  console.log("FILTER RANGE:", startDate, endDate)

  const dashboard = await Order.aggregate([

    {
      $match:{
        franchiseId,
        status:"billed",
        createdAt:{
          $gte:startDate,
          $lte:endDate
        }
      }
    },

    {
      $facet:{

        /* SUMMARY */

       summary: [

  { $unwind: "$items" },

  {
    $group:{
      _id:null,
      totalSales:{ $sum:"$totalAmount" },
      totalCost:{
        $sum:{
          $multiply:["$items.costPrice","$items.qty"]
        }
      }
    }
  },

  {
    $project:{
      _id:0,
      totalSales:1,
      totalCost:1,
      totalProfit:{
        $subtract:["$totalSales","$totalCost"]
      }
    }
  }

],

        /* PRODUCT SALES */

        productSales:[
          { $unwind:"$items" },
          {
            $group:{
              _id:"$items.menuId",
              name:{ $first:"$items.name" },
              qty:{ $sum:"$items.qty" }
            }
          }
        ]

      }
    }

  ])

  const data = dashboard[0] || {}

  const products = data.productSales || []

  const topSelling = [...products]
    .sort((a,b)=>b.qty-a.qty)
    .slice(0,5)

  const lowSelling = [...products]
    .sort((a,b)=>a.qty-b.qty)
    .slice(0,5)

  /* TODAY SALES SEPARATE */

const todayData = await Order.aggregate([

{
 $match:{
   franchiseId,
   status:"billed",
   createdAt:{
     $gte:today.start,
     $lte:today.end
   }
 }
},

{ $unwind:"$items" },

{
 $group:{
   _id:null,
   todaySales:{ $sum:"$totalAmount" },
   todayCost:{
     $sum:{
       $multiply:["$items.costPrice","$items.qty"]
     }
   }
 }
},

{
 $project:{
   _id:0,
   todaySales:1,
   todayProfit:{
     $subtract:["$todaySales","$todayCost"]
   }
 }
}

])

  return {

    summary: data.summary?.[0] || {
      totalSales:0,
      totalProfit:0
    },

    today: todayData?.[0] || {
      todaySales:0,
      todayProfit:0
    },

    products:{
      topSelling,
      lowSelling
    }

  }

}

// exports.getSuperAdminDashboard = async () => {

//   const now = new Date();

//   /* ================= DATE RANGES ================= */

//   const todayStart = new Date();
//   todayStart.setHours(0, 0, 0, 0);

//   const weekStart = new Date();
//   weekStart.setDate(now.getDate() - 7);

//   const monthStart = new Date();
//   monthStart.setMonth(now.getMonth() - 1);

//   const yearStart = new Date(now.getFullYear(), 0, 1);
//   const yearEnd = new Date(now.getFullYear() + 1, 0, 1);

//   /* =====================================================
//       ✅ TOTAL SALES (ALL FRANCHISES)
//      ===================================================== */

//   const totalSalesAgg = await Bill.aggregate([
//     {
//       $match: {
//         paymentStatus: "paid"
//       }
//     },
//     {
//       $group: {
//         _id: null,
//         daily: {
//           $sum: {
//             $cond: [
//               { $gte: ["$createdAt", todayStart] },
//               "$totalAmount",
//               0
//             ]
//           }
//         },
//         weekly: {
//           $sum: {
//             $cond: [
//               { $gte: ["$createdAt", weekStart] },
//               "$totalAmount",
//               0
//             ]
//           }
//         },
//         monthly: {
//           $sum: {
//             $cond: [
//               { $gte: ["$createdAt", monthStart] },
//               "$totalAmount",
//               0
//             ]
//           }
//         }
//       }
//     }
//   ]);

//   const totalSales = totalSalesAgg[0] || {
//     daily: 0,
//     weekly: 0,
//     monthly: 0
//   };

//   /* ================= FRANCHISE DATA ================= */

//   const franchises = await Franchise.find().lean();

//   const monthNames = [
//     "Jan","Feb","Mar","Apr","May","Jun",
//     "Jul","Aug","Sep","Oct","Nov","Dec"
//   ];

// const franchiseReports = await Promise.all(
//   franchises.map(async (franchise) => {

//     /* ===== DAILY / WEEKLY / MONTHLY SALES ===== */

//     const salesAgg = await Bill.aggregate([
//       {
//         $match: {
//           franchiseId: franchise._id,
//           paymentStatus: "paid"
//         }
//       },
//       {
//         $group: {
//           _id: null,

//           daily: {
//             $sum: {
//               $cond: [
//                 { $gte: ["$createdAt", todayStart] },
//                 "$totalAmount",
//                 0
//               ]
//             }
//           },

//           weekly: {
//             $sum: {
//               $cond: [
//                 { $gte: ["$createdAt", weekStart] },
//                 "$totalAmount",
//                 0
//               ]
//             }
//           },

//           monthly: {
//             $sum: {
//               $cond: [
//                 { $gte: ["$createdAt", monthStart] },
//                 "$totalAmount",
//                 0
//               ]
//             }
//           }
//         }
//       }
//     ]);

//     const sales = salesAgg[0] || {
//       daily: 0,
//       weekly: 0,
//       monthly: 0
//     };

//     /* ===== MONTHLY CHART (JAN–DEC) ===== */

//     const monthlyAgg = await Bill.aggregate([
//       {
//         $match: {
//           franchiseId: franchise._id,
//           paymentStatus: "paid",
//           createdAt: {
//             $gte: yearStart,
//             $lt: yearEnd
//           }
//         }
//       },
//       {
//         $group: {
//           _id: { $month: "$createdAt" },
//           totalRevenue: { $sum: "$totalAmount" }
//         }
//       }
//     ]);

//     const monthlyRevenue = Array(12).fill(0);

//     monthlyAgg.forEach(m => {
//       monthlyRevenue[m._id - 1] = m.totalRevenue;
//     });

//     const monthlyChart = monthNames.map((month, i) => ({
//       month,
//       revenue: monthlyRevenue[i]
//     }));

//     return {
//       franchiseId: franchise._id,
//       franchiseName: franchise.name,

//       // ✅ NEW SALES DATA
//       sales: {
//         daily: sales.daily || 0,
//         weekly: sales.weekly || 0,
//         monthly: sales.monthly || 0
//       },

//       monthlyChart
//     };
//   })
// );


//   /* ================= FINAL RESPONSE ================= */

//   return {
//     totalFranchises: franchises.length,

//     totalSales: {
//       daily: totalSales.daily || 0,
//       weekly: totalSales.weekly || 0,
//       monthly: totalSales.monthly || 0
//     },

//     franchises: franchiseReports
//   };
// };




exports.getSuperAdminDashboard = async (query) => {

  const { startDate, endDate, year, month, franchiseId } = query;

  const now = new Date();

  /* ================= DATE VARIABLES ================= */

  const todayStart = new Date();
  todayStart.setHours(0,0,0,0);

  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(todayStart.getDate() - 1);

  const yesterdayEnd = new Date(todayStart);

  const weekStart = new Date(todayStart);
  weekStart.setDate(todayStart.getDate() - 7);

  const monthStart = new Date();
  monthStart.setDate(1);

  const lastMonthStart = new Date(now.getFullYear(), now.getMonth()-1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  /* ================= RANGE FILTER ================= */

  let rangeStart = null;
  let rangeEnd = null;

  if (startDate && endDate) {
    rangeStart = new Date(startDate);
    rangeEnd = new Date(endDate);
  }

  if (year && !month) {
    rangeStart = new Date(`${year}-01-01`);
    rangeEnd = new Date(`${year}-12-31`);
  }

  if (year && month) {
    rangeStart = new Date(year, month-1, 1);
    rangeEnd = new Date(year, month, 0);
  }

  const match = { paymentStatus:"paid" };

  if(rangeStart && rangeEnd){
    match.createdAt = { $gte: rangeStart, $lte: rangeEnd };
  }

  if(franchiseId){
    match.franchiseId = franchiseId;
  }

  /* ================= MAIN AGGREGATION ================= */

  const result = await Bill.aggregate([

    { $match: match },

    {
      $facet: {

        /* ===== TOTAL SALES ===== */

        totals:[
          {
            $group:{
              _id:null,

              daily:{
                $sum:{
                  $cond:[
                    {$gte:["$createdAt", todayStart]},
                    "$totalAmount",
                    0
                  ]
                }
              },

              weekly:{
                $sum:{
                  $cond:[
                    {$gte:["$createdAt", weekStart]},
                    "$totalAmount",
                    0
                  ]
                }
              },

              monthly:{
                $sum:{
                  $cond:[
                    {$gte:["$createdAt", monthStart]},
                    "$totalAmount",
                    0
                  ]
                }
              }

            }
          }
        ],

        /* ===== FRANCHISE SALES ===== */

        franchiseSales:[
          {
            $group:{
              _id:"$franchiseId",

              daily:{
                $sum:{
                  $cond:[
                    {$gte:["$createdAt", todayStart]},
                    "$totalAmount",
                    0
                  ]
                }
              },

              weekly:{
                $sum:{
                  $cond:[
                    {$gte:["$createdAt", weekStart]},
                    "$totalAmount",
                    0
                  ]
                }
              },

              monthly:{
                $sum:{
                  $cond:[
                    {$gte:["$createdAt", monthStart]},
                    "$totalAmount",
                    0
                  ]
                }
              }

            }
          }
        ],

        /* ===== MONTHLY CHART ===== */

        monthlyChart:[
          {
            $group:{
              _id:{
                franchiseId:"$franchiseId",
                month:{ $month:"$createdAt" }
              },
              revenue:{ $sum:"$totalAmount" }
            }
          }
        ]

      }
    }

  ]);

  const totals = result[0].totals[0] || {daily:0,weekly:0,monthly:0};
  const franchiseSales = result[0].franchiseSales;
  const monthlyChartData = result[0].monthlyChart;

  /* ================= TOP ITEMS ================= */

  const topItems = await Bill.aggregate([

    { $match:{ paymentStatus:"paid" }},

    { $unwind:"$items" },

    {
      $facet:{

        today:[
          { $match:{ createdAt:{ $gte: todayStart } } },
          {
            $group:{
              _id:{ franchiseId:"$franchiseId", item:"$items.name"},
              qty:{ $sum:"$items.qty"}
            }
          },
          {$sort:{qty:-1}}
        ],

        yesterday:[
          { $match:{ createdAt:{ $gte:yesterdayStart, $lt:yesterdayEnd } } },
          {
            $group:{
              _id:{ franchiseId:"$franchiseId", item:"$items.name"},
              qty:{ $sum:"$items.qty"}
            }
          },
          {$sort:{qty:-1}}
        ],

        weekly:[
          { $match:{ createdAt:{ $gte:weekStart } } },
          {
            $group:{
              _id:{ franchiseId:"$franchiseId", item:"$items.name"},
              qty:{ $sum:"$items.qty"}
            }
          },
          {$sort:{qty:-1}}
        ],

        lastMonth:[
          { $match:{ createdAt:{ $gte:lastMonthStart, $lte:lastMonthEnd } } },
          {
            $group:{
              _id:{ franchiseId:"$franchiseId", item:"$items.name"},
              qty:{ $sum:"$items.qty"}
            }
          },
          {$sort:{qty:-1}}
        ]

      }
    }

  ]);

  /* ================= HELPER ================= */

  const getTopItem = (fid, list)=>{
    const item = list.find(
      i => i._id.franchiseId.toString() === fid.toString()
    );
    if(!item) return null;
    return { name:item._id.item, qty:item.qty };
  };

  /* ================= GET FRANCHISE LIST ================= */

  const franchises = franchiseId
    ? await Franchise.find({_id:franchiseId}).lean()
    : await Franchise.find().lean();

  const monthNames=[
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  /* ================= BUILD RESPONSE ================= */

  const franchiseReports = franchises.map(franchise=>{

    const sales = franchiseSales.find(
      f=>f._id.toString() === franchise._id.toString()
    );

    const monthlyRevenue = Array(12).fill(0);

    monthlyChartData
      .filter(m=>m._id.franchiseId.toString() === franchise._id.toString())
      .forEach(m=>{
        monthlyRevenue[m._id.month-1] = m.revenue;
      });

    const monthlyChart = monthNames.map((m,i)=>({
      month:m,
      revenue:monthlyRevenue[i]
    }));

    return{

      franchiseId: franchise._id,
      franchiseName: franchise.name,

      sales:{
        daily: sales?.daily || 0,
        weekly: sales?.weekly || 0,
        monthly: sales?.monthly || 0
      },

      topItems:{
        today: getTopItem(franchise._id, topItems[0].today),
        yesterday: getTopItem(franchise._id, topItems[0].yesterday),
        weekly: getTopItem(franchise._id, topItems[0].weekly),
        lastMonth: getTopItem(franchise._id, topItems[0].lastMonth)
      },

      monthlyChart

    };

  });

  /* ================= FINAL RESPONSE ================= */

  return{

    totalFranchises: franchises.length,

    totalSales:{
      daily: totals.daily,
      weekly: totals.weekly,
      monthly: totals.monthly
    },

    franchises: franchiseReports

  };

};