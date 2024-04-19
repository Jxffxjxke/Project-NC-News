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
  const [filterBy] = Object.keys(req.query);
  const topic = req.query[filterBy];
  let shouldCheck = false;
  if (filterBy) {
    shouldCheck = true;
  }
  Promise.all([
    fetchArticles(filterBy, topic),
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
