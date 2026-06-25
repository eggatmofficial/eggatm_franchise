const loyaltyService = require("./loyalty.service");

exports.checkPoints = async (req, res) => {
  try {
    const result =
      await loyaltyService.checkPoints(req.body);

    res.status(200).json({
      success: true,
      message: "Loyalty points fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};