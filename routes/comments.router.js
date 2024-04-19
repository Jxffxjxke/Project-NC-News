const {
  deleteCommentById,
  patchComment,
} = require("../controllers/comments.controllers");
const commentRouter = require( "express" ).Router();

commentRouter.patch("/:commentId", patchComment);
commentRouter.delete("/:commentId", deleteCommentById);

module.exports = commentRouter;
