module.exports = (err, req, res, next) => {
  console.log(err);
  if (err.name === "Handled") {
    res.status(err.status).json(err.message);
  } else if (err.message.match(/(duplicate)/gi)) {
    res.status(400).json({ message: "Email has registered already" });
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
