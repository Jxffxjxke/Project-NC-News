const { fetchComments, insertComment } = require("../models/comments.models");
const { checkArticleExists } = require("../models/articles.models");

exports.getCommentsByArticle = (req, res, next) => {
  const articleId = req.params.articleId;
  Promise.all([fetchComments(articleId), checkArticleExists(articleId)])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByArticle = (req, res, next) => {
  const articleId = req.params.articleId;
  const { body, author } = req.body;
  return checkArticleExists(articleId)
    .then(() => {
      return insertComment(body, articleId, author);
    })
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
