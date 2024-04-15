const { getTopics } = require("./controllers/topic.controllers");
const { sendURLError } = require("./errors/errors");

const express = require("express");
const app = express();

app.get("/api/topics", getTopics);

app.all("*", sendURLError);

module.exports = app;
