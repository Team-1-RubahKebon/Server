const mongoose = require("mongoose");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

let connect = mongoose
  .connect(process.env.MONGO_DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`connected to mongo`))
  .catch((err) => console.log(err));

module.exports = connect;
