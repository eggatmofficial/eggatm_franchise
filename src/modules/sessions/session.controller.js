const service = require("./session.service");

class SessionController {

  start = async (req, res, next) => {
    try {
      const session = await service.startSession(
        req.body.tableId,
        req.user
      );

      res.json({
        success: true,
        message: "Session started",
        data: session,
      });
    } catch (err) {
      next(err);
    }
  };

  getActive = async (req, res, next) => {
    try {
      const session = await service.getActiveSession(
        req.params.tableId,
        req.user.franchiseId
      );

      res.json({
        success: true,
        data: session,
      });
    } catch (err) {
      next(err);
    }
  };

  close = async (req, res, next) => {
    try {
      const session = await service.closeSession(
        req.params.id,
        req.user.franchiseId
      );

      res.json({
        success: true,
        message: "Session closed",
        data: session,
      });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new SessionController();
