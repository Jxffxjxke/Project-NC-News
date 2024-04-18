const {
  fetchArticle,
  fetchArticles,
  updateVotes,
} = require("../models/articles.models");
const { checkTopicExists } = require("../models/topic.models");

exports.getArticle = (req, res, next) => {
  const { articleId } = req.params;
  return fetchArticle(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const { topic, sort_by, order } = req.query;
  let shouldCheck = topic ? true : false;
  Promise.all([
    fetchArticles(topic, sort_by, order),
    checkTopicExists(shouldCheck, topic),
  ])
    .then(([articles]) => {
      if (!articles.length) {
        res.status(200).send({ message: "No articles with related topic" });
      } else {
        res.status(200).send({ articles });
      }
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
