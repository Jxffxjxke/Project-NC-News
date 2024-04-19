const {
  getArticle,
  getArticles,
  patchArticleVotes,
} = require("../controllers/articles.controllers");
const {
  getCommentsByArticle,
  postCommentByArticle,
} = require("../controllers/comments.controllers");
const articleRouter = require("express").Router();

articleRouter.get("/:articleId", getArticle);
articleRouter.get( "/", getArticles );
articleRouter.patch("/:articleId", patchArticleVotes);
articleRouter.get("/:articleId/comments", getCommentsByArticle);
articleRouter.post("/:articleId/comments", postCommentByArticle);

module.exports = articleRouter;
