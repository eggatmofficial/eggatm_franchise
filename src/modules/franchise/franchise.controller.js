const asyncHandler = require("../../common/middleware/asyncHandler");
const franchiseService = require("./franchise.service");
const { success } = require("../../common/utils/response.util");

class FranchiseController {

  create = asyncHandler(async (req, res) => {
    
    const data = await franchiseService.create(req.body);
    
    success(res, data, "Franchise created");
  });

  getAll = asyncHandler(async (req, res) => {
    const data = await franchiseService.getAll();
    success(res, data);
  });

  update = asyncHandler(async (req, res) => {
    const data = await franchiseService.update(
      req.params.id,
      req.body
    );
    success(res, data, "Franchise updated");
  });

  delete = asyncHandler(async (req, res) => {
    await franchiseService.delete(req.params.id);
    success(res, null, "Franchise deleted");
  });


toggleStatus = asyncHandler(async (req, res) => {

  // SAFE ACCESS
  const isActive = req.body?.isActive;

  // VALIDATION
  if (typeof isActive === "undefined") {
    return res.status(400).json({
      success: false,
      message: "isActive field is required",
    });
  }

  const data = await franchiseService.toggleStatus(
    req.params.id,
    isActive
  );

  success(res, data, "Franchise status updated");
});

// In your franchise.controller.js
getById = asyncHandler(async (req, res) => {
  const data = await franchiseService.getById(req.params.id);
  if (!data) {
    return res.status(404).json({
      success: false,
      message: "Franchise not found"
    });
  }
  success(res, data);
});
}

module.exports = new FranchiseController();
