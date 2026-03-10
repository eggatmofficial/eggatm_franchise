const service = require("./menu.service");

/* CREATE */
exports.create = async (req, res) => {

  const data = await service.create(
    req.body,
    req.file,
    req.user.franchiseId
  );

  res.json({
    success: true,
    message: "Menu created",
    data,
  });
};

/* GET ALL */
exports.getAll = async (req, res) => {

  const data = await service.getAll(req.user.franchiseId);

  res.json({
    success: true,
    data,
  });
};

/* UPDATE */
exports.update = async (req, res) => {

  const data = await service.update(
    req.params.id,
    req.body,
    req.file
  );

  res.json({
    success: true,
    message: "Menu updated",
    data,
  });
};

/* DELETE */
exports.delete = async (req, res) => {

  await service.delete(req.params.id);

  res.json({
    success: true,
    message: "Menu deleted",
  });
};
