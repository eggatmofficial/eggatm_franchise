const Session = require("./session.model");
const Table = require("../tables/tables.model");

class SessionService {

  /* ================= START SESSION ================= */
  async startSession(tableId, user) {

    const table = await Table.findOne({
      _id: tableId,
      franchiseId: user.franchiseId,
      isActive: true,
    });

    if (!table) throw new Error("Table not found");

    if (table.status !== "available") {
      throw new Error("Table already occupied");
    }

    // create session
    const session = await Session.create({
      tableId,
      franchiseId: user.franchiseId,
      startedBy: user.id,
    });

    // update table
    table.status = "occupied";
    await table.save();

    return session;
  }

  /* ================= GET ACTIVE SESSION ================= */
  async getActiveSession(tableId, franchiseId) {

    return Session.findOne({
      tableId,
      franchiseId,
      status: "active",
    });
  }

  /* ================= CLOSE SESSION ================= */
  async closeSession(sessionId, franchiseId) {

    const session = await Session.findOne({
      _id: sessionId,
      franchiseId,
    });

    if (!session) throw new Error("Session not found");

    session.status = "closed";
    session.closedAt = new Date();
    await session.save();

    // free table
    await Table.findByIdAndUpdate(
      session.tableId,
      { status: "available" }
    );

    return session;
  }
}

module.exports = new SessionService();
