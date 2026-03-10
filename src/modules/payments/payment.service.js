const crypto = require("crypto");

const PaymentRequest = require("./paymentRequest.model");
const Payment = require("./payment.model");
const Menu = require("../menu/menu.model");
const Order = require("../orders/orders.model");
const GuestTab = require("../guestTabs/guestTabs.model");
const Session = require("../sessions/session.model");
const Table = require("../tables/tables.model");
const Franchise = require("../franchise/franchise.model");
const Bill = require("../billing/billing.model");



/* =====================================================
   PROCEED PAYMENT (SMART FLOW)
   Staff click → auto or approval
===================================================== */

exports.proceedPayment = async (user, tabId, method) => {

  if (!tabId)
    throw new Error("tabId required");

  const franchise = await Franchise.findById(user.franchiseId);

  if (!franchise)
    throw new Error("Franchise not found");

  /* ================= AUTO MODE ================= */
  if (!franchise.requirePaymentApproval) {

    console.log("✅ AUTO PAYMENT MODE (STAFF)");

    return await completePaymentDirect(user, tabId, method);
  }

  /* ================= OWNER APPROVAL ================= */
  console.log("🔒 OWNER APPROVAL MODE");

  return await exports.createRequest(user, { tabId });
};


/* =====================================================
   CREATE PAYMENT REQUEST (STAFF SIDE)
===================================================== */

exports.createRequest = async (user, body) => {

  const { tabId, amount } = body;

  if (!tabId)
    throw new Error("tabId required");

  /* CHECK GUEST TAB */
  const tab = await GuestTab.findById(tabId);

  if (!tab)
    throw new Error("Guest tab not found");

  if (!tab.isActive)
    throw new Error("Guest already closed");

  if (tab.totalAmount <= 0)
    throw new Error("No bill amount");

  /* PREVENT DUPLICATE REQUEST */
  const existing = await PaymentRequest.findOne({
    tabId,
    status: "pending",
  });

  if (existing)
    throw new Error("Payment already requested");

  console.log("🧾 PAYMENT REQUEST CREATED:", tabId);

  const request = await PaymentRequest.create({
    _id: crypto.randomUUID(),
    sessionId: tab.sessionId,
    tableId: tab.tableId,
    tabId,
    amount: amount || tab.totalAmount,
    requestedBy: user._id,
    status: "pending",
  });

  return request;
};


/* =====================================================
   GET BILLING QUEUE (FRANCHISE PANEL)
===================================================== */

exports.getPendingRequests = async () => {

  const requests = await PaymentRequest.find({
    status: "pending",
  }).sort({ createdAt: -1 });

  /* attach table + guest info */
  const result = await Promise.all(
    requests.map(async (r) => {

      const table = await Table.findById(r.tableId);
      const tab = await GuestTab.findById(r.tabId);

      return {
        ...r.toObject(),
        tableName: table?.tableNumber || r.tableId,
        guestName: tab?.guestName || "Guest",
      };
    })
  );

  return result;
};



/* =====================================================
   COMPLETE PAYMENT (BILLING COUNTER)
===================================================== */


// exports.completePayment = async (user, requestId, method) => {

//   const request = await PaymentRequest.findOneAndUpdate(
//     { _id: requestId, status: "pending" },
//     { status: "processing" },
//     { new: true }
//   );

//   if (!request)
//     throw new Error("Invalid payment");

//   /* ================= CREATE PAYMENT ================= */
//   await Payment.create({
//     _id: crypto.randomUUID(),
//     sessionId: request.sessionId,
//     tableId: request.tableId,
//     tabId: request.tabId,
//     amount: request.amount,
//     paymentMethod: method,
//     collectedBy: user._id,
//   });

//   /* ================= COMPLETE ORDERS ================= */
//   await Order.updateMany(
//     { tabId: request.tabId },
//     { $set: { status: "completed" } }
//   );

//   /* ✅ MARK BILL AS PAID */
//  await Bill.findOneAndUpdate(
//   { tabId: request.tabId },
//   {
//     paymentMethod: method,
//     paymentStatus: "paid",
//     status: "paid",
//   },
//   { new: true }
// );


//   /* ================= CLOSE TAB ================= */
//   await GuestTab.findByIdAndUpdate(request.tabId, {
//     status: "paid",
//     isActive: false,
//   });


//   /* ================= CHECK SESSION COMPLETE ================= */

// const remainingTabs = await GuestTab.countDocuments({
//   sessionId: request.sessionId,
//   isActive: true,
// });

// if (remainingTabs === 0) {

//   console.log("🏁 ALL GUESTS PAID → FREE TABLE");

//   await Session.findByIdAndUpdate(
//     request.sessionId,
//     { status: "closed" }
//   );

//   await Table.findByIdAndUpdate(
//     request.tableId,
//     { status: "available" }
//   );
// }

//   /* ================= CLOSE REQUEST ================= */
//   await PaymentRequest.findByIdAndUpdate(
//     requestId,
//     { status: "paid" }
//   );

//   console.log("✅ PAYMENT + BILL CLOSED");

//   return { success: true };
// };


const Customer = require("../customers/customer.model");

exports.completePayment = async (user, requestId, method) => {

  const request = await PaymentRequest.findOneAndUpdate(
    { _id: requestId, status: "pending" },
    { status: "processing" },
    { new: true }
  );

  if (!request)
    throw new Error("Invalid payment");

  /* PAYMENT RECORD */
  await Payment.create({
    _id: crypto.randomUUID(),
    sessionId: request.sessionId,
    tableId: request.tableId,
    tabId: request.tabId,
    amount: request.amount,
    paymentMethod: method,
    collectedBy: user._id,
  });

  /* COMPLETE ORDERS */
  await Order.updateMany(
    { tabId: request.tabId },
    { $set: { status: "completed" } }
  );

  /* MARK BILL PAID */
  const bill = await Bill.findOneAndUpdate(
    { tabId: request.tabId },
    {
      paymentMethod: method,
      paymentStatus: "paid",
      status: "paid",
    },
    { new: true }
  );

  /* ================= PROFIT CALCULATION ================= */

let totalCost = 0;

for (const item of bill.items) {

  const menu = await Menu.findById(item.menuId);

  if (!menu) continue;

  totalCost += (menu.costPrice || 0) * item.qty;
}

const totalProfit = bill.totalAmount - totalCost;

await Bill.findByIdAndUpdate(
  bill._id,
  {
    totalCost,
    totalProfit
  }
);

console.log("💰 Profit:", totalProfit);


  /* ================= LOYALTY POINTS ================= */

  if (bill?.customerId) {

    const points = Math.floor(bill.totalAmount / 20);

    const customer = await Customer.findByIdAndUpdate(
      bill.customerId,
      { $inc: { loyaltyPoints: points } },
      { new: true }
    );

    if (customer.loyaltyPoints >= 100 && !customer.rewardEligible) {
      customer.rewardEligible = true;
      await customer.save();
    }

    console.log("⭐ Points Added:", points);
  }

  /* CLOSE TAB */
  await GuestTab.findByIdAndUpdate(request.tabId, {
    status: "paid",
    isActive: false,
  });

  /* SESSION CHECK */
  const remainingTabs = await GuestTab.countDocuments({
    sessionId: request.sessionId,
    isActive: true,
  });

  if (remainingTabs === 0) {
    await Session.findByIdAndUpdate(
      request.sessionId,
      { status: "closed" }
    );

    await Table.findByIdAndUpdate(
      request.tableId,
      { status: "available" }
    );
  }

  await PaymentRequest.findByIdAndUpdate(
    requestId,
    { status: "paid" }
  );

  return { success: true };
};



/* =====================================================
   DIRECT PAYMENT (NO OWNER)
===================================================== */

// async function completePaymentDirect(user, tabId, method) {

//   if (!["cash","card","upi"].includes(method))
//     throw new Error("Invalid payment method");

//   const tab = await GuestTab.findById(tabId);

//   if (!tab)
//     throw new Error("Guest tab not found");

//   /* CREATE PAYMENT */
//   await Payment.create({
//     _id: crypto.randomUUID(),
//     sessionId: tab.sessionId,
//     tableId: tab.tableId,
//     tabId,
//     amount: tab.totalAmount,
//     paymentMethod: method,
//     collectedBy: user._id,
//   });

//   /* COMPLETE ALL ORDERS */
//   await Order.updateMany(
//     { tabId, status: "pending" },
//     { $set: { status: "completed" } }
//   );

//   /* ✅ MARK BILL PAID */
// await Bill.findOneAndUpdate(
//   { tabId },
//   {
//     paymentMethod: method,
//     paymentStatus: "paid",
//     status: "paid",
//   },
//   { new: true }
// );



//   /* CLOSE TAB */
//   await GuestTab.findByIdAndUpdate(tabId, {
//     status: "paid",
//     isActive: false,
//   });

//   /* ================= CHECK SESSION COMPLETE ================= */

// const remainingTabs = await GuestTab.countDocuments({
//   sessionId: tab.sessionId,
//   isActive: true,
// });

// if (remainingTabs === 0) {

//   console.log("🏁 SESSION CLOSED → TABLE AVAILABLE");

//   await Session.findByIdAndUpdate(
//     tab.sessionId,
//     { status: "closed" }
//   );

//   await Table.findByIdAndUpdate(
//     tab.tableId,
//     { status: "available" }
//   );
// }

//   console.log("✅ STAFF DIRECT PAYMENT SUCCESS");

//   return {
//     success: true,
//     message: "Payment completed directly",
//   };
// }

async function completePaymentDirect(user, tabId, method) {

  const Customer = require("../customers/customer.model");
  const Menu = require("../menu/menu.model");

  const tab = await GuestTab.findById(tabId);
  if (!tab) throw new Error("Guest tab not found");

  /* CREATE PAYMENT */
  await Payment.create({
    _id: crypto.randomUUID(),
    sessionId: tab.sessionId,
    tableId: tab.tableId,
    tabId,
    amount: tab.totalAmount,
    paymentMethod: method,
    collectedBy: user._id,
  });

  /* COMPLETE ORDERS */
  await Order.updateMany(
    { tabId, status: "pending" },
    { $set: { status: "completed" } }
  );

  /* MARK BILL PAID */
  const bill = await Bill.findOneAndUpdate(
    { tabId },
    {
      paymentMethod: method,
      paymentStatus: "paid",
      status: "paid",
    },
    { new: true }
  );


    /* ================= PROFIT CALCULATION ================= */

let totalCost = 0;

for (const item of bill.items) {

  const menu = await Menu.findById(item.menuId);

  if (!menu) continue;

  totalCost += (menu.costPrice || 0) * item.qty;
}

const totalProfit = bill.totalAmount - totalCost;

await Bill.findByIdAndUpdate(
  bill._id,
  {
    totalCost,
    totalProfit
  }
);

console.log("💰 Profit:", totalProfit);


  /* ================= LOYALTY POINTS ================= */

  if (bill?.customerId) {

    const points = Math.floor(bill.totalAmount / 20);

    const customer = await Customer.findByIdAndUpdate(
      bill.customerId,
      { $inc: { loyaltyPoints: points } },
      { new: true }
    );

    if (customer.loyaltyPoints >= 100 && !customer.rewardEligible) {
      customer.rewardEligible = true;
      await customer.save();
    }

    console.log("⭐ Points Added:", points);
  }

  /* CLOSE TAB */
  await GuestTab.findByIdAndUpdate(tabId, {
    status: "paid",
    isActive: false,
  });

  /* SESSION COMPLETE CHECK */
  const remainingTabs = await GuestTab.countDocuments({
    sessionId: tab.sessionId,
    isActive: true,
  });

  if (remainingTabs === 0) {

    await Session.findByIdAndUpdate(
      tab.sessionId,
      { status: "closed" }
    );

    await Table.findByIdAndUpdate(
      tab.tableId,
      { status: "available" }
    );
  }

  console.log("✅ STAFF DIRECT PAYMENT SUCCESS");

  return {
    success: true,
    message: "Payment completed directly",
  };
}






