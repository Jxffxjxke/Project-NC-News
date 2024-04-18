const { fetchTopics } = require("../models/topic.models");

exports.getTopics = (req, res, next) => {
  return fetchTopics()
    .then((topics) => {
      res.status(200).send({topics});
    })
    .catch((err) => {
      next(err);
    });
};
