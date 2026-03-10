const tableService = require("./tables.service");

class TableController {

  create = async (req, res, next) => {
    try {
      const franchiseId = req.user.franchiseId;

      const table = await tableService.create(
        req.body,
        franchiseId
      );

      res.json({
        success: true,
        message: "Table created",
        data: table,
      });
    } catch (err) {
      next(err);
    }
  };

  getAll = async (req, res, next) => {
    try {
      const franchiseId = req.user.franchiseId;

      const tables = await tableService.getAll(franchiseId);

      res.json({
        success: true,
        data: tables,
      });
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const franchiseId = req.user.franchiseId;

      const table = await tableService.update(
        req.params.id,
        req.body,
        franchiseId
      );

      res.json({
        success: true,
        message: "Table updated",
        data: table,
      });
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const franchiseId = req.user.franchiseId;

      await tableService.delete(
        req.params.id,
        franchiseId
      );

      res.json({
        success: true,
        message: "Table deleted",
      });
    } catch (err) {
      next(err);
    }
  };

  /* GET SINGLE TABLE */
getOne = async (req, res, next) => {
  try {
    const table = await tableService.getById(
      req.params.id,
      req.user.franchiseId
    );

    res.json({
      success: true,
      data: table,
    });

  } catch (err) {
    next(err);
  }
};

}

module.exports = new TableController();
