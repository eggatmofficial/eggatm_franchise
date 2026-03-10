const app = require("./app");
const connectDB = require("./config/db.config");
const { PORT } = require("./config/env.config");

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
