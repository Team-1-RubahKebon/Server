const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const router = require("./routers");
const errorHandler = require("./middlewares/errorHandler");
require("./connection");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("./"));
app.use(cors());
app.use(express.json());
app.use(router);
app.use(errorHandler);

app.listen(PORT, () => console.log(`listening to port ${PORT}`));

// module.exports =  app 
