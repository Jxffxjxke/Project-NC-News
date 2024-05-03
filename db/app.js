const { sendURLError, sendError } = require("../errors");
const express = require("express");
const app = express();
const apiRouter = require("../routes/api-router");
const cors = require( "cors" );

app.use(cors());

app.use(express.json());
app.use("/api", apiRouter);

app.use(sendError);
app.all("*", sendURLError);

module.exports = app;
