const {
  deleteCommentById,
} = require("../controllers/comments.controllers");

const commentRouter = require("express").Router();


commentRouter.delete("/:commentId", deleteCommentById);

module.exports = commentRouter;