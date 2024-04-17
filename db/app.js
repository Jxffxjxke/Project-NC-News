const { getTopics } = require("./controllers/topic.controllers");
const { sendURLError, sendError } = require("./errors/errors");
const { getEndpoints } = require("./controllers/endpoints.controllers");
const {
  getArticle,
  getArticles,
  patchArticleVotes,
} = require("./controllers/articles.controllers");
const {
  getCommentsByArticle,
  postCommentByArticle,
  deleteCommentById,
} = require("./controllers/comments.controllers");
const { getUsers } = require("./controllers/users.controllers");

const express = require("express");
const app = express();

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/users", getUsers);

app.get("/api/articles/:articleId", getArticle);
app.patch("/api/articles/:articleId", patchArticleVotes);

app.get("/api/articles/:articleId/comments", getCommentsByArticle);
app.post("/api/articles/:articleId/comments", postCommentByArticle);

app.delete("/api/comments/:commentId", deleteCommentById);

app.use(sendError);
app.all("*", sendURLError);

module.exports = app;
