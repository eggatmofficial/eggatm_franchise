const User = require("./auth.model");
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

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    };
  }

}

module.exports = new AuthService();
