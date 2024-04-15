const { fetchArticle } = require("../models/articles.models");

exports.getArticle = (req, res, next) => {
  const articleId = req.params.articleId;
  return fetchArticle(articleId)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      next(err);
    });
};
