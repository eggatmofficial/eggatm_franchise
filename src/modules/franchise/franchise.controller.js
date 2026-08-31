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

/* ===== CRM: franchise-wise customer count (Admin Dashboard) ===== */
getCustomerStats = asyncHandler(async (req, res) => {
  const data = await franchiseService.getCustomerCountStats();
  success(res, data);
});

/* ===== CRM: customers/phone numbers of one franchise ===== */
getFranchiseCustomers = asyncHandler(async (req, res) => {
  const data = await franchiseService.getFranchiseCustomers(req.params.id);
  success(res, data);
});

/* ===== CRM: edit reward points config ===== */
updateRewardsConfig = asyncHandler(async (req, res) => {
  const data = await franchiseService.updateRewardsConfig(
    req.params.id,
    req.body
  );
  success(res, data, "Rewards config updated");
});

/* ===== CRM: download customers as excel ===== */
exportCustomers = asyncHandler(async (req, res) => {
  const workbook = await franchiseService.exportCustomersExcel(
    req.query.franchiseId
  );

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="customers-${Date.now()}.xlsx"`
  );

  await workbook.xlsx.write(res);
  res.end();
});
}

module.exports = new FranchiseController();
