module.exports = (err, req, res, next) => {
  console.log(err);
  console.log(err.message);
  if (err.name.match(/(BSON)/gi) || err.message.match(/(BSON)/gi)) {
    res.status(400).json({ message: "wrong parameter" });
  } else if (err.name === "Handled") {
    res.status(err.status).json(err.message);
  } else if (err.message.match(/(duplicate)/gi)) {
    res.status(400).json({ message: "Email has registered already" });
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
