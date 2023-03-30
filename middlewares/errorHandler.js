module.exports = (err, req, res, next) => {
  console.log(err);
  if (err.name === "Handled") {
    res.status(err.status).json(err.message);
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
