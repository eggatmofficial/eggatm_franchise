const Table = require("./tables.model");

class TableService {

  /* CREATE TABLE */
  async create(payload, franchiseId) {

    const table = await Table.create({
      franchiseId,
      tableNumber: payload.tableNumber,
      capacity: payload.capacity || 4,
    });

    return table;
  }

  /* GET ALL TABLES */
  async getAll(franchiseId) {
    return Table.find({
      franchiseId,
      isActive: true,
    }).sort({ tableNumber: 1 });
  }

  /* UPDATE TABLE */
  async update(id, payload, franchiseId) {

    const table = await Table.findOneAndUpdate(
      { _id: id, franchiseId },
      payload,
      { new: true }
    );

    if (!table) throw new Error("Table not found");

    return table;
  }

  /* DELETE TABLE */
  async delete(id, franchiseId) {

    const table = await Table.findOneAndDelete({
      _id: id,
      franchiseId,
    });

    if (!table) throw new Error("Table not found");

    return true;
  }

  /* UPDATE STATUS (used by sessions later) */
  async updateStatus(tableId, status) {
    await Table.findByIdAndUpdate(tableId, { status });
  }

   /* ⭐ GET SINGLE TABLE */
  async getById(id, franchiseId) {

    const table = await Table.findOne({
      _id: id,
      franchiseId,
      isActive: true,
    });

    if (!table) throw new Error("Table not found");

    return table;
  }

}

module.exports = new TableService();
