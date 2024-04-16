const { getTopics } = require("./controllers/topic.controllers");
const { sendURLError, sendError } = require("./errors/errors");
const { getEndpoints } = require("./controllers/endpoints.controllers");
const {
  getArticle,
  getArticles,
} = require("./controllers/articles.controllers");
const {
  getCommentsByArticle,
  postCommentByArticle,
} = require("./controllers/comments.controllers");

const express = require("express");
const app = express();

app.use(express.json())

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);
app.get("/api/articles/:articleId", getArticle);
app.get("/api/articles/:articleId/comments", getCommentsByArticle);

app.post("/api/articles/:articleId/comments", postCommentByArticle);

app.use(sendError);
app.all("*", sendURLError);

module.exports = app;
