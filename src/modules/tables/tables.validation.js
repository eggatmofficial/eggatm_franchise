exports.createTableValidation = (body) => {
  if (!body.tableNumber)
    throw new Error("Table number required");
};
