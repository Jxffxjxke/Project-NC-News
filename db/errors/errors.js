exports.sendURLError = (req, res) => {
  res.status(404).send({ message: "URL not found" });
};

exports.sendError = (err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  } else if (err.code === "22P02") {
    res.status(400).send({ message: "Bad request" });
  }
};
