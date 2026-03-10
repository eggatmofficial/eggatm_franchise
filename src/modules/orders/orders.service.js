// const Order = require("./orders.model");
// const GuestTab = require("../guestTabs/guestTabs.model"); // ⭐ ADD
// const crypto = require("crypto");

// exports.create = async (user, body) => {

//   console.log("SERVICE BODY =>", body);

//   if (!body) {
//     throw new Error("Request body missing");
//   }

//   const { sessionId, tableId, tabId, items } = body;

//   if (!tabId || tabId === "undefined") {
//   throw new Error("Valid tabId required");
// }


//   if (!sessionId)
//     throw new Error("sessionId required");

//   if (!tableId)
//     throw new Error("tableId required");

//   if (!items || !items.length)
//     throw new Error("Order items required");

//   const totalAmount = items.reduce(
//     (sum, i) => sum + (i.price * i.qty),
//     0
//   );

//   /* ================= CREATE ORDER ================= */

//   const order = await Order.create({
//     _id: crypto.randomUUID(),
//     sessionId,
//     tableId,
//     tabId,
//     items,
//     totalAmount,
//     status: "pending",
//   });

//   /* ================= UPDATE TAB TOTAL ⭐ ================= */

//   const tabOrders = await Order.find({
//     tabId,
//     status: "pending",
//   });

//   const newTotal = tabOrders.reduce(
//     (sum, o) => sum + o.totalAmount,
//     0
//   );

//   await GuestTab.findByIdAndUpdate(tabId, {
//     totalAmount: newTotal,
//   });

//   /* ======================================================= */

//   return order;
// };



const Order = require("./orders.model");
const GuestTab = require("../guestTabs/guestTabs.model");
const crypto = require("crypto");
const Menu = require("../menu/menu.model")

const Table = require("../tables/tables.model");
const User = require("../auth/auth.model");

exports.create = async (user, body) => {

    console.log("req user in service",user);
    

  console.log("📥 ORDER REQUEST =>", body);

  const {
    sessionId,
    tableId,
    tabId,
    items,
    clientOrderId
  } = body;

  if (!tabId || tabId === "undefined")
    throw new Error("Valid tabId required");

  if (!sessionId)
    throw new Error("sessionId required");

  if (!tableId)
    throw new Error("tableId required");

  if (!items || !items.length)
    throw new Error("Order items required");

  /* ================= DUPLICATE ORDER CHECK ================= */

  if (clientOrderId) {

    const existingOrder = await Order.findOne({
      clientOrderId
    });

    if (existingOrder) {
      console.log("⚠️ Duplicate order prevented");
      return existingOrder;
    }
  }

  /* ================= CALCULATE TOTAL ================= */

//   const totalAmount = items.reduce(
//     (sum, i) => sum + (i.price * i.qty),
//     0
//   );

const enrichedItems = [];

for (const item of items) {

  const menu = await Menu.findById(item.menuId);

  if (!menu)
    throw new Error("Menu item not found");

  enrichedItems.push({
    menuId: menu._id,
    name: menu.name,
    price: menu.price,
    costPrice: menu.costPrice || 0, // ⭐ KEY LINE
    qty: item.qty
  });
}

const totalAmount = enrichedItems.reduce(
  (sum, i) => sum + (i.price * i.qty),
  0
);


  console.log("🧾 Order Total:", totalAmount);

  /* ================= CREATE ORDER ================= */

  const order = await Order.create({
    _id: crypto.randomUUID(),
    sessionId,
    tableId,
    tabId,
    items:enrichedItems,
    totalAmount,
    clientOrderId,
    status: "pending",
    createdBy: user.id,
    franchiseId: user.franchiseId,
  });

  console.log("✅ Order Created:", order._id);

  /* ================= RECALCULATE TAB TOTAL ================= */

  const tabOrders = await Order.find({
    tabId,
    status: { $ne: "cancelled" },
  });

  console.log("📦 Orders in tab:", tabOrders.length);

  const newTotal = tabOrders.reduce(
    (sum, o) => sum + o.totalAmount,
    0
  );

  console.log("💰 New Tab Total:", newTotal);

  await GuestTab.findByIdAndUpdate(
    tabId,
    { totalAmount: newTotal },
    { new: true }
  );

  console.log("🔄 GuestTab updated");

  return order;
};





exports.getReports = async (
  franchiseId,
  type,
  page = 1,
  limit = 10
) => {

  const now = new Date();
  let startDate = new Date();

  if (type === "today") {
    startDate.setHours(0,0,0,0);
  }
  else if (type === "weekly") {
    startDate.setDate(now.getDate() - 7);
  }
  else if (type === "monthly") {
    startDate.setMonth(now.getMonth() - 1);
  }

  const matchQuery = {
    franchiseId,
    status: "completed",
    createdAt: { $gte: startDate }
  };

  const skip = (page - 1) * limit;

  /* =====================================================
     ✅ GROUP ALL ORDERS INTO ONE BILL PER TAB
  ===================================================== */

  const orders = await Order.aggregate([

    { $match: matchQuery },

    /* ⭐ GROUP BY TAB (ONE BILL) */
    {
      $group: {
        _id: "$tabId",
        sessionId: { $first: "$sessionId" },
        tableId: { $first: "$tableId" },
        createdAt: { $max: "$createdAt" },

        totalAmount: { $sum: "$totalAmount" },

        items: { $push: "$items" }
      }
    },

    /* ⭐ FLATTEN ITEMS ARRAY */
    {
      $project: {
        tabId: "$_id",
        sessionId: 1,
        tableId: 1,
        createdAt: 1,
        totalAmount: 1,
        items: {
          $reduce: {
            input: "$items",
            initialValue: [],
            in: { $concatArrays: ["$$value", "$$this"] }
          }
        }
      }
    },

    /* JOIN TABLE NUMBER */
    {
      $lookup: {
        from: "tables",
        localField: "tableId",
        foreignField: "_id",
        as: "table"
      }
    },

    {
      $unwind: {
        path: "$table",
        preserveNullAndEmptyArrays: true
      }
    },

    {
      $addFields: {
        tableNumber: "$table.tableNumber"
      }
    },

    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit }
  ]);

  /* ================= SUMMARY ================= */

  const allOrders = await Order.find(matchQuery).lean();

  const totalSales = allOrders.reduce(
    (s,o)=> s + o.totalAmount, 0
  );

  const totalItemsSold = allOrders.reduce(
    (sum,order)=>
      sum + order.items.reduce((q,i)=> q+i.qty,0),
    0
  );

  const totalBills = new Set(
    allOrders.map(o => o.tabId)
  ).size; // ⭐ UNIQUE BILLS

  const totalCount = totalBills;

  return {
    summary: {
      totalSales,
      totalBills,
      totalItemsSold
    },
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    },
    orders
  };
};
