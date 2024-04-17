const {
  fetchArticle,
  fetchArticles,
  updateVotes,
} = require("../models/articles.models");

exports.getArticle = (req, res, next) => {
  const articleId = req.params.articleId;
  return fetchArticle(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const [ filterBy ] = Object.keys( req.query );
  const query = req.query[filterBy]
  return fetchArticles(filterBy, query)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleVotes = (req, res, next) => {
  const { articleId } = req.params;
  const changeVotes = req.body.inc_votes;
  return updateVotes(articleId, changeVotes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
