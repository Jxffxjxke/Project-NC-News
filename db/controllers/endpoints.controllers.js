const fs = require("fs/promises");

exports.getEndpoints = (req, res, next) => {
  return fs
    .readFile(
      "/home/jxffxjxke/northcoders/backend/be-nc-news/endpoints.json",
      (err, data) => {
        if (err) next(err);
        return data;
      }
    )
    .then((data) => {
      return res.status(200).send(JSON.parse(data));
    });
};
