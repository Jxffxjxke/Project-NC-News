exports.sendURLError = (req, res) => {
  res.status(404).send({ message: "URL not found" });
};
