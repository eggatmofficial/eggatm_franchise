const asyncHandler = require("../../common/middleware/asyncHandler");
const authService = require("./auth.service");
const { success } = require("../../common/utils/response.util");

class AuthController {

  login = asyncHandler(async (req, res) => {
    const data = await authService.login(req.body);
    success(res, data, "Login successful");
  });

}

module.exports = new AuthController();
