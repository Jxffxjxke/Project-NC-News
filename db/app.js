const { getTopics } = require("./controllers/topic.controllers");
const { sendURLError, sendMadeError } = require("./errors/errors");
const { getEndpoints } = require("./controllers/endpoints.controllers");
const { getArticle } = require("./controllers/articles.controllers");

const express = require("express");
const app = express();

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:articleId", getArticle);

app.use(sendMadeError)
app.all("*", sendURLError);

module.exports = app;
