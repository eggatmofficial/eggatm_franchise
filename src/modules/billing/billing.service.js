const Order = require("../orders/orders.model");
const GuestTab = require("../guestTabs/guestTabs.model");
const Bill = require("./billing.model");
const crypto = require("crypto");
const Table = require("../tables/tables.model")
const Session = require("../sessions/session.model")
const Staff = require("../auth/auth.model")
const Customer = require("../customers/customer.model")
const Franchise = require("../franchise/franchise.model");

/* ================= PREVIEW ================= */

// exports.previewBill = async (tabId) => {

//   const orders = await Order.find({
//     tabId,
//     status: "pending",
//   });

//   if (!orders.length)
//     throw new Error("No pending orders");

//   const map = {};

//   orders.forEach(order => {
//     order.items.forEach(i => {

//       if (!map[i.menuId]) {
//         map[i.menuId] = {
//           menuId: i.menuId,
//           name: i.name,
//           price: i.price,
//           qty: 0,
//           subtotal: 0
//         };
//       }

//       map[i.menuId].qty += i.qty;
//       map[i.menuId].subtotal =
//         map[i.menuId].qty * i.price;
//     });
//   });

//   const items = Object.values(map);

//   const total = items.reduce(
//     (s, i) => s + i.subtotal,
//     0
//   );

//   return {
//     items,
//     subtotal: total,
//     grandTotal: total
//   };
// };


exports.previewBill = async (tabId) => {

  /* ===================================================
     1️⃣ CHECK IF BILL ALREADY EXISTS
  =================================================== */

  const existingBill = await Bill.findOne({ tabId });

  if (existingBill) {

    console.log("📄 Preview from GENERATED BILL");

    return {
      items: existingBill.items,
      subtotal: existingBill.subTotal,
      grandTotal: existingBill.totalAmount,
      source: "bill"
    };
  }

  /* ===================================================
     2️⃣ OTHERWISE LOAD PENDING ORDERS (STAFF FLOW)
  =================================================== */

  const orders = await Order.find({
    tabId,
    status: "pending",
  });

  if (!orders.length)
    throw new Error("No pending orders");

  const map = {};

  orders.forEach(order => {
    order.items.forEach(i => {

      if (!map[i.menuId]) {
        map[i.menuId] = {
          menuId: i.menuId,
          name: i.name,
          price: i.price,
          costPrice: i.costPrice,
          qty: 0,
          subtotal: 0
        };
      }

      map[i.menuId].qty += i.qty;
      map[i.menuId].subtotal =
        map[i.menuId].qty * i.price;
    });
  });

  const items = Object.values(map);

  const total = items.reduce(
    (s, i) => s + i.subtotal,
    0
  );

  console.log("🧾 Preview from PENDING ORDERS");

  return {
    items,
    subtotal: total,
    grandTotal: total,
    source: "orders"
  };
};


/* ================= GENERATE BILL ================= */

exports.generateBill = async ({
  user,
  tabId,
  customerName,
  customerMobile
}) => {

    console.log("user",user);
    console.log("tabid",tabId);
     console.log("customerName",customerName);
     console.log("customer Mobile",customerMobile)
    
    
  const tab = await GuestTab.findById(tabId);
  if (!tab) throw new Error("Guest tab not found");

  const preview = await exports.previewBill(tabId);

  /* ================= CUSTOMER FIND/CREATE ================= */

  let customerId = null;

  if (customerMobile) {

    let customer = await Customer.findOne({
      phone: customerMobile,
      franchiseId: user.franchiseId
    });

    if (!customer) {
      customer = await Customer.create({
        name: customerName || "Walk-in Customer",
        phone: customerMobile,
        franchiseId: user.franchiseId,
        loyaltyPoints: 0,
        visits: 0,
        rewardEligible: false
      });
    }

    customerId = customer._id;
  }

  /* ================= CREATE BILL ================= */

  const bill = await Bill.create({
    _id: crypto.randomUUID(),
    sessionId: tab.sessionId,
    tableId: tab.tableId,
    tabId,
    franchiseId: user.franchiseId,

    billNumber: "INV-" + Date.now(),

    items: preview.items,
    subTotal: preview.subtotal,
    totalAmount: preview.grandTotal,

    paymentStatus: "pending",
    status: "generated",

    generatedBy: user.id,

    customerName,
    customerMobile,
    customerId
  });

  await Order.updateMany(
    { tabId, status: "pending" },
    { status: "billed" }
  );

  await GuestTab.findByIdAndUpdate(tabId, {
    status: "billed"
  });

  return bill;
};





/* ================= GET BILLS ================= */

exports.getBills = async (franchiseId) => {

  /* 1️⃣ Get ALL bills of this franchise */
  const bills = await Bill.find({
    franchiseId
  })
    .sort({ createdAt: -1 })
    .lean();

  if (!bills.length) return [];

  /* 2️⃣ Collect IDs */
  const tableIds = [...new Set(bills.map(b => b.tableId))];
  const sessionIds = [...new Set(bills.map(b => b.sessionId))];
  const staffIds = [...new Set(bills.map(b => b.generatedBy))];

  /* 3️⃣ Fetch related data */
  const [tables, sessions, staffs] = await Promise.all([
    Table.find({ _id: { $in: tableIds } }).lean(),
    Session.find({ _id: { $in: sessionIds } }).lean(),
    Staff.find({ _id: { $in: staffIds } }).lean()
  ]);

  /* 4️⃣ Lookup maps */
  const tableMap = {};
  tables.forEach(t => {
    tableMap[String(t._id)] = t.tableNumber;
  });

  const sessionMap = {};
  sessions.forEach(s => {
    sessionMap[String(s._id)] = s.guestName || "Guest";
  });

  const staffMap = {};
  staffs.forEach(st => {
    staffMap[String(st._id)] =
      st.name || st.fullName || "Staff";
  });

  /* 5️⃣ Final response */
  return bills.map(bill => ({
    ...bill,
    tableName: `Table ${tableMap[bill.tableId] || "N/A"}`,
    guestName: sessionMap[bill.sessionId] || "Guest",
    staffName: staffMap[bill.generatedBy] || "Staff",
    amount: bill.totalAmount
  }));
};




exports.getMyBills = async (userId, franchiseId) => {

  // 1️⃣ Get bills
  const bills = await Bill.find({
    franchiseId,
    generatedBy: userId
  })
    .sort({ createdAt: -1 })
    .lean();

  // 2️⃣ Collect unique tableIds
  const tableIds = [
    ...new Set(bills.map(b => b.tableId))
  ];

  // 3️⃣ Fetch all tables in ONE query
  const tables = await Table.find({
    _id: { $in: tableIds }
  }).lean();

  // 4️⃣ Create lookup map
  const tableMap = {};
  tables.forEach(t => {
    tableMap[t._id] = t.tableNumber;
  });

  // 5️⃣ Attach tableNumber
  const result = bills.map(bill => ({
    ...bill,
    tableNumber: tableMap[bill.tableId] || "N/A",
    itemsSummary: bill.items
      .map(i => `${i.name} x${i.qty}`)
      .join(", ")
  }));

  return result;
};




exports.getPrintQueue = async (franchiseId) => {

  return await Bill.find({
    franchiseId,
    paymentStatus: "paid",
    printStatus: "pending"
  })
  .sort({ createdAt: 1 })
  .lean();
};



/* ================= GET PRINTABLE BILL ================= */


exports.getPrintableBill = async (billId, franchiseId) => {

  const bill = await Bill.findOne({
    _id: billId,
    franchiseId
  }).lean();

  if (!bill)
    throw new Error("Bill not found");

  /* ===== LOOKUP FRANCHISE ===== */

  const franchise = await Franchise.findById(
    bill.franchiseId
  )
  .select("name address city state phone franchiseCode")
  .lean();
console.log("franchise",franchise);
console.log("bill",bill);


  return {
    ...bill,
    franchise 
  };
};


/* ================= MARK PRINTED ================= */

exports.markBillPrinted = async (billId, userId) => {

  const bill = await Bill.findById(billId);

  if (!bill)
    throw new Error("Bill not found");

  // prevent duplicate update
  if (bill.printStatus === "printed") {
    return bill;
  }

  bill.printStatus = "printed";
  bill.printedAt = new Date();
  bill.printedBy = userId;

  await bill.save();

  return bill;
};