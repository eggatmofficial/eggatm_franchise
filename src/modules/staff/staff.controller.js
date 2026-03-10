const asyncHandler = require("../../common/middleware/asyncHandler");
const staffService = require("./staff.service");
const { success } = require("../../common/utils/response.util");

class StaffController {

  create = asyncHandler(async (req, res) => {

    const data = await staffService.create(
      req.body,
      req.user.franchiseId
    );

    success(res, data, "Staff created");
  });

  getAll = asyncHandler(async (req, res) => {

    const data = await staffService.getAll(
      req.user.franchiseId
    );

    success(res, data);
  });

  update = asyncHandler(async (req, res) => {

    const data = await staffService.update(
      req.params.id,
      req.body,
      req.user.franchiseId
    );

    success(res, data, "Staff updated");
  });

  delete = asyncHandler(async (req, res) => {

    await staffService.delete(
      req.params.id,
      req.user.franchiseId
    );

    success(res, null, "Staff deleted");
  });
}

module.exports = new StaffController();
