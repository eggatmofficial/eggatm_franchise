const GuestTab = require("./guestTabs.model");
const Session = require("../sessions/session.model");
const Table = require("../tables/tables.model");
const { v4: uuidv4 } = require("uuid");

/* ================= CREATE TAB ================= */

exports.create = async (user, body) => {

  const { sessionId, tableId, guestName } = body;

  if (!sessionId) throw new Error("sessionId required");
  if (!tableId) throw new Error("tableId required");

  // check session exists
  const session = await Session.findById(sessionId);
  if (!session) throw new Error("Session not found");

  const tab = await GuestTab.create({
    _id: uuidv4(),
    sessionId,
    tableId,
    guestName: guestName || "Guest",
  });

  return tab;
};


/* ================= GET TABS BY SESSION ================= */

exports.getBySession = async (sessionId) => {

  return await GuestTab.find({
    sessionId,
    isActive: true,
  }).sort({ createdAt: 1 });

};


/* ================= PAY TAB ================= */

exports.payTab = async (tabId) => {

  const tab = await GuestTab.findById(tabId);
  if (!tab) throw new Error("Tab not found");

  tab.status = "paid";
  tab.isActive = false;

  await tab.save();

  /* ✅ CHECK IF ALL TABS CLOSED */
  const activeTabs = await GuestTab.countDocuments({
    sessionId: tab.sessionId,
    status: "active",
  });

  // if no active tabs → free table
  if (activeTabs === 0) {

    await Session.findByIdAndUpdate(
      tab.sessionId,
      { status: "closed" }
    );

    await Table.findByIdAndUpdate(
      tab.tableId,
      { status: "available" }
    );
  }

  return tab;
};


/* ================= DELETE TAB ================= */

exports.remove = async (tabId) => {

  const tab = await GuestTab.findById(tabId);
  if (!tab) throw new Error("Tab not found");

  await GuestTab.findByIdAndDelete(tabId);

  return true;
};
