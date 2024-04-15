exports.sendURLError = (req, res) => {
  res.status(404).send({ message: "URL not found" });
};

exports.sendMadeError = (err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  }
};
