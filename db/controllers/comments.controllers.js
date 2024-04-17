const {
  fetchComments,
  insertComment,
  removeComment,
  checkCommentExists,
} = require("../models/comments.models");
const { checkArticleExists } = require("../models/articles.models");
const { checkUsernameExists } = require("../models/users.models");

exports.getCommentsByArticle = (req, res, next) => {
  const { articleId } = req.params;
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
  Promise.all([
    checkUsernameExists(author),
    insertComment(body, articleId, author),
  ])
    .then(([_, comment]) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentById = (req, res, next) => {
  const { commentId } = req.params;

  Promise.all([checkCommentExists(commentId), removeComment(commentId)])
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
