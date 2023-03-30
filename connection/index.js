const mongoose = require("mongoose");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
module.exports = mongoose.connect(process.env.MONGO_DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
