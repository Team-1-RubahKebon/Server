module.exports = (err, req, res, next) => {
  console.log(err);
  console.log(err.message);
  if (err.name === "Handled") {
    res.status(err.status).json(err.message);
  } else if (err.message.match(/(duplicate)/gi)) {
    res.status(400).json({ message: "Email has registered already" });
  } else if (err.name.match(/(jsonweb)/gi)) {
    res.status(401).json({ message: "Wrong Token" });
  } else if (err.name?.match(/(BSON)/gi) || err.message?.match(/(BSON)/gi)) {
    res.status(400).json({ message: "wrong parameter" });
  } else if (err.message === 'You are not authorized') {
    res.status(401).json({ message: "You are not authorized" });
  }
  else {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
