const endpoints = require("../../endpoints.json");

exports.getEndpoints = (req, res, next) => {
  if (endpoints) {
    return res.status(200).send(endpoints);
  }
};
