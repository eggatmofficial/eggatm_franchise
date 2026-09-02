// const User = require("./auth.model");
// const {
//   comparePassword,
//   generateToken,
// } = require("./auth.helper");

// class AuthService {

//   async login(payload) {
//     const { email, password } = payload;

//     const user = await User.findOne({ email })
//       .select("+password");

//     if (!user) {
//       throw new Error("Invalid credentials");
//     }

//      if (!user.isActive) {
//       throw new Error("Account disabled by admin");
//     }

//     const isMatch = await comparePassword(
//       password,
//       user.password
//     );

//     if (!isMatch) {
//       throw new Error("Invalid credentials");
//     }

//     const token = generateToken(user);

//     return {
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         role: user.role,
//       },
//     };
//   }

// }

// module.exports = new AuthService();



const User = require("./auth.model");
const Franchise = require("../franchise/franchise.model");
const {
  comparePassword,
  generateToken,
} = require("./auth.helper");

class AuthService {

  async login(payload) {
    const { email, password } = payload;

    const user = await User.findOne({ email })
      .select("+password");

    if (!user) {
      throw new Error("Invalid credentials");
    }

     if (!user.isActive) {
      throw new Error("Account disabled by admin");
    }

    const isMatch = await comparePassword(
      password,
      user.password
    );

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = generateToken(user);

    // Fetch franchise name and phone so the frontend can display it without an extra API call
    let franchiseName = null;
    let franchisePhone = null;
    if (user.franchiseId) {
      try {
        const franchise = await Franchise.findById(user.franchiseId).select("name phone");
        if (franchise) {
          franchiseName = franchise.name;
          franchisePhone = franchise.phone || null;
        }
      } catch {
        /* non-critical – proceed without franchise info */
      }
    }

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        franchiseId: user.franchiseId || null,
        franchiseName: franchiseName,
        franchisePhone: franchisePhone,
      },
    };
  }

}

module.exports = new AuthService();
