const app = require("./app");
const connectDB = require("./config/db.config");
const { PORT } = require("./config/env.config");

connectDB();

const port = process.env.PORT || PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});