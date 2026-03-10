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
}

module.exports = new FranchiseService();