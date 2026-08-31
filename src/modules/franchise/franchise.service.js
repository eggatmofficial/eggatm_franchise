// const Franchise = require("./franchise.model");
// const User = require("../auth/auth.model");
// const { hashPassword } = require("../auth/auth.helper");
// const ROLES = require("../../common/constants/roles.constant");
// const { generateFranchiseCode } = require("../../common/utils/idGenerator.util");

// class FranchiseService {

//   async create(payload) {

//     const franchiseCode = await generateFranchiseCode();

//     const franchise = await Franchise.create({
//       franchiseCode,
//       name: payload.name,
//       ownerName: payload.ownerName,
//       phone: payload.phone,
//       address: payload.address,
//       city: payload.city,
//       state: payload.state,
//     });

//     const password = await hashPassword(payload.password);

//     await User.create({
//       name: payload.ownerName,
//       email: payload.email,
//       password,
//       role: ROLES.FRANCHISE,
//       franchiseId: franchise._id,
//     });

//     console.log("francise",franchise);
    

//     return franchise;
//   }

//   async getAll() {
//     return Franchise.find().sort({ createdAt: -1 });
//   }

//  async update(id, payload) {

//   const franchise = await Franchise.findByIdAndUpdate(
//     id,
//     {
//       name: payload.name,
//       ownerName: payload.ownerName,
//       phone: payload.phone,
//       address: payload.address,
//       city: payload.city,
//       state: payload.state,
//     },
//     { new: true }
//   );

//   if (!franchise) {
//     throw new Error("Franchise not found");
//   }


//   if (payload.email || payload.ownerName) {

//     await User.findOneAndUpdate(
//       {
//         franchiseId: id,
//         role: ROLES.FRANCHISE,
//       },
//       {
//         email: payload.email,
//         name: payload.ownerName,
//       }
//     );
//   }

//   return franchise;
// }

// //soft delete

// // async delete(id) {

// //   // 1️⃣ deactivate franchise
// //   const franchise = await Franchise.findByIdAndUpdate(
// //     id,
// //     { isActive: false },
// //     { new: true }
// //   );

// //   if (!franchise) {
// //     throw new Error("Franchise not found");
// //   }

// //   // 2️⃣ deactivate franchise owner
// //   await User.updateMany(
// //     {
// //       franchiseId: id,
// //       role: ROLES.FRANCHISE,
// //     },
// //     { isActive: false }
// //   );

// //   // 3️⃣ deactivate all staff
// //   await User.updateMany(
// //     {
// //       franchiseId: id,
// //       role: ROLES.STAFF,
// //     },
// //     { isActive: false }
// //   );

// //   return franchise;
// // }


// //hard delete

// async delete(id) {

//   // 1️⃣ Check franchise exists
//   const franchise = await Franchise.findById(id);

//   if (!franchise) {
//     throw new Error("Franchise not found");
//   }

//   // 2️⃣ Delete franchise owner user
//   await User.deleteMany({
//     franchiseId: id,
//     role: ROLES.FRANCHISE,
//   });

//   // 3️⃣ Delete all staff users
//   await User.deleteMany({
//     franchiseId: id,
//     role: ROLES.STAFF,
//   });

//   // 4️⃣ Delete franchise itself
//   await Franchise.findByIdAndDelete(id);

//   return true;
// }


// async toggleStatus(id, isActive) {

//   // 1️⃣ update franchise
//   const franchise = await Franchise.findByIdAndUpdate(
//     id,
//     { isActive },
//     { new: true }
//   );

//   if (!franchise) {
//     throw new Error("Franchise not found");
//   }

//   // 2️⃣ update franchise owner
//   await User.updateMany(
//     {
//       franchiseId: id,
//       role: ROLES.FRANCHISE,
//     },
//     { isActive }
//   );

//   // 3️⃣ update all staff
//   await User.updateMany(
//     {
//       franchiseId: id,
//       role: ROLES.STAFF,
//     },
//     { isActive }
//   );

//   return franchise;
// }



// }

// module.exports = new FranchiseService();







const Franchise = require("./franchise.model");
const User = require("../auth/auth.model");
const Customer = require("../customers/customer.model");
const { hashPassword } = require("../auth/auth.helper");
const ROLES = require("../../common/constants/roles.constant");
const { generateFranchiseCode } = require("../../common/utils/idGenerator.util");

class FranchiseService {

  async create(payload) {
    const franchiseCode = await generateFranchiseCode();

    const franchise = await Franchise.create({
      franchiseCode,
      name: payload.name,
      ownerName: payload.ownerName,
      phone: payload.phone,
      address: payload.address,
      city: payload.city,
      state: payload.state,
    });

    const password = await hashPassword(payload.password);

    const user = await User.create({
      name: payload.ownerName,
      email: payload.email,
      password,
      role: ROLES.FRANCHISE,
      franchiseId: franchise._id,
    });

    console.log("franchise", franchise);
    
    // Manually construct the response with email
    const franchiseWithEmail = {
      ...franchise.toObject(),
      email: user.email
    };
    
    return franchiseWithEmail;
  }

  async getAll() {
    const franchises = await Franchise.find().sort({ createdAt: -1 });
    
    // For each franchise, find the associated user and attach email
    const franchisesWithEmail = await Promise.all(
      franchises.map(async (franchise) => {
        const user = await User.findOne({
          franchiseId: franchise._id,
          role: ROLES.FRANCHISE
        }).select('email');
        
        return {
          ...franchise.toObject(),
          email: user?.email || null
        };
      })
    );
    
    return franchisesWithEmail;
  }

  async getById(id) {
    const franchise = await Franchise.findById(id);
    
    if (!franchise) {
      return null;
    }
    
    const user = await User.findOne({
      franchiseId: id,
      role: ROLES.FRANCHISE
    }).select('email');
    
    return {
      ...franchise.toObject(),
      email: user?.email || null
    };
  }

  async update(id, payload) {
    const franchise = await Franchise.findByIdAndUpdate(
      id,
      {
        name: payload.name,
        ownerName: payload.ownerName,
        phone: payload.phone,
        address: payload.address,
        city: payload.city,
        state: payload.state,
      },
      { new: true }
    );

    if (!franchise) {
      throw new Error("Franchise not found");
    }

    if (payload.email || payload.ownerName) {
      await User.findOneAndUpdate(
        {
          franchiseId: id,
          role: ROLES.FRANCHISE,
        },
        {
          email: payload.email,
          name: payload.ownerName,
        }
      );
    }

    // Return updated franchise with email
    const updatedFranchiseWithEmail = await this.getById(id);
    return updatedFranchiseWithEmail;
  }

  //hard delete
  async delete(id) {
    // 1️⃣ Check franchise exists
    const franchise = await Franchise.findById(id);

    if (!franchise) {
      throw new Error("Franchise not found");
    }

    // 2️⃣ Delete franchise owner user
    await User.deleteMany({
      franchiseId: id,
      role: ROLES.FRANCHISE,
    });

    // 3️⃣ Delete all staff users
    await User.deleteMany({
      franchiseId: id,
      role: ROLES.STAFF,
    });

    // 4️⃣ Delete franchise itself
    await Franchise.findByIdAndDelete(id);

    return true;
  }

  async toggleStatus(id, isActive) {
    // 1️⃣ update franchise
    const franchise = await Franchise.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );

    if (!franchise) {
      throw new Error("Franchise not found");
    }

    // 2️⃣ update franchise owner
    await User.updateMany(
      {
        franchiseId: id,
        role: ROLES.FRANCHISE,
      },
      { isActive }
    );

    // 3️⃣ update all staff
    await User.updateMany(
      {
        franchiseId: id,
        role: ROLES.STAFF,
      },
      { isActive }
    );

    // Return updated franchise with email
    const updatedFranchiseWithEmail = await this.getById(id);
    return updatedFranchiseWithEmail;
  }

  /* =====================================================
     ✅ CRM: FRANCHISE-WISE CUSTOMER COUNT (Admin Dashboard)
  ===================================================== */

  async getCustomerCountStats() {

    const franchises = await Franchise.find().sort({ createdAt: -1 }).lean();

    const counts = await Customer.aggregate([
      { $group: { _id: "$franchiseId", count: { $sum: 1 } } }
    ]);

    const countMap = {};
    counts.forEach(c => { countMap[c._id] = c.count; });

    const totalCustomers = counts.reduce((sum, c) => sum + c.count, 0);

    const franchiseStats = franchises.map(f => ({
      franchiseId: f._id,
      name: f.name,
      franchiseCode: f.franchiseCode,
      phone: f.phone,
      city: f.city,
      isActive: f.isActive,
      pointsPerAmount: f.pointsPerAmount ?? 100,
      rewardThreshold: f.rewardThreshold ?? 90,
      customerCount: countMap[f._id] || 0
    }));

    return {
      totalFranchises: franchises.length,
      totalCustomers,
      franchises: franchiseStats
    };
  }

  /* =====================================================
     ✅ CRM: SHOW CUSTOMERS (PHONE NUMBERS) OF ONE FRANCHISE
  ===================================================== */

  async getFranchiseCustomers(id) {

    const franchise = await Franchise.findById(id).lean();

    if (!franchise) {
      throw new Error("Franchise not found");
    }

    const customers = await Customer.find({ franchiseId: id })
      .sort({ createdAt: -1 })
      .lean();

    return { franchise, customers };
  }

  /* =====================================================
     ✅ CRM: EDIT REWARD POINTS CONFIG (Editable rewards points)
  ===================================================== */

  async updateRewardsConfig(id, payload) {

    const update = {};

    if (payload.pointsPerAmount !== undefined) {
      update.pointsPerAmount = Number(payload.pointsPerAmount);
    }

    if (payload.rewardThreshold !== undefined) {
      update.rewardThreshold = Number(payload.rewardThreshold);
    }

    const franchise = await Franchise.findByIdAndUpdate(id, update, { new: true });

    if (!franchise) {
      throw new Error("Franchise not found");
    }

    return franchise;
  }

  /* =====================================================
     ✅ CRM: DOWNLOAD CUSTOMERS AS EXCEL
     - franchiseId provided  -> single sheet for that franchise
     - franchiseId omitted   -> one sheet per franchise (all franchises)
  ===================================================== */

  async exportCustomersExcel(franchiseId) {

    const ExcelJS = require("exceljs");
    const workbook = new ExcelJS.Workbook();

    const columns = [
      { header: "Name", key: "name", width: 25 },
      { header: "Phone", key: "phone", width: 18 },
      { header: "Loyalty Points", key: "loyaltyPoints", width: 15 },
      { header: "Reward Eligible", key: "rewardEligible", width: 15 },
      { header: "Joined On", key: "createdAt", width: 20 },
      { header: "Redeemed Rewards Count", key: "rewardsRedeemed", width: 30 },
    ];

    const addSheet = (name, customers) => {
      const safeName = String(name || "Franchise")
        .replace(/[\\/\?\*\[\]:]/g, "")
        .substring(0, 31) || "Franchise";

      const sheet = workbook.addWorksheet(safeName);
      sheet.columns = columns;

      customers.forEach(c => {
        sheet.addRow({
          name: c.name || "",
          phone: c.phone,
          loyaltyPoints: c.loyaltyPoints || 0,
          rewardEligible: c.rewardEligible ? "Yes" : "No",
          createdAt: c.createdAt
            ? new Date(c.createdAt).toLocaleDateString()
            : "",
          rewardsRedeemed: c.rewardsRedeemed || 0,
        });
      });

      sheet.getRow(1).font = { bold: true };
    };

    if (franchiseId) {

      const franchise = await Franchise.findById(franchiseId).lean();

      if (!franchise) {
        throw new Error("Franchise not found");
      }

      const customers = await Customer.find({ franchiseId })
        .sort({ createdAt: -1 })
        .lean();

      addSheet(franchise.name, customers);

    } else {

      const franchises = await Franchise.find().lean();

      if (!franchises.length) {
        workbook.addWorksheet("No Data");
      }

      for (const franchise of franchises) {
        const customers = await Customer.find({ franchiseId: franchise._id })
          .sort({ createdAt: -1 })
          .lean();

        addSheet(franchise.name || franchise._id, customers);
      }
    }

    return workbook;
  }
}

module.exports = new FranchiseService();