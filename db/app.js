const { getTopics } = require("./controllers/topic.controllers");
const { sendURLError } = require("./errors/errors");
const { getEndpoints } = require("./controllers/endpoints.controllers");

const express = require("express");
const app = express();

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.all("*", sendURLError);

module.exports = app;
