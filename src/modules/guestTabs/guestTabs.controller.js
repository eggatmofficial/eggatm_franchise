const service = require("./guestTabs.service");

/* CREATE TAB */
exports.create = async (req, res, next) => {
  try {
    const tab = await service.create(req.user, req.body);

    res.json({
      success: true,
      data: tab,
    });

  } catch (err) {
    next(err);
  }
};


/* GET BY SESSION */
exports.getBySession = async (req, res, next) => {
  try {

    const tabs = await service.getBySession(
      req.params.sessionId
    );

    res.json({
      success: true,
      data: tabs,
    });

  } catch (err) {
    next(err);
  }
};


/* PAY TAB */
exports.payTab = async (req, res, next) => {
  try {

    const tab = await service.payTab(req.params.id);

    res.json({
      success: true,
      data: tab,
    });

  } catch (err) {
    next(err);
  }
};


/* DELETE TAB */
exports.remove = async (req, res, next) => {
  try {

    await service.remove(req.params.id);

    res.json({
      success: true,
      message: "Tab deleted",
    });

  } catch (err) {
    next(err);
  }
};
