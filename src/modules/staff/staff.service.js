const User = require("../auth/auth.model");
const { hashPassword } = require("../auth/auth.helper");
const ROLES = require("../../common/constants/roles.constant");

class StaffService {

  async create(payload, franchiseId) {

    const password = await hashPassword(payload.password);

    const staff = await User.create({
      name: payload.name,
      email: payload.email,
      password,
      role: ROLES.STAFF,
      franchiseId,
    });

    return staff;
  }


  async getAll(franchiseId) {

    return User.find({
      franchiseId,
      role: ROLES.STAFF,
    }).select("-password");
  }


  async update(id, payload, franchiseId) {

    const updateData = { ...payload };

    if (payload.password) {
      updateData.password = await hashPassword(payload.password);
    }

    const staff = await User.findOneAndUpdate(
      {
        _id: id,
        franchiseId,
        role: ROLES.STAFF,
      },
      updateData,
      { new: true }
    ).select("-password");

    if (!staff) throw new Error("Staff not found");

    return staff;
  }


  async delete(id, franchiseId) {

    const staff = await User.findOneAndDelete({
      _id: id,
      franchiseId,
      role: ROLES.STAFF,
    });

    if (!staff) throw new Error("Staff not found");

    return true;
  }
}

module.exports = new StaffService();
