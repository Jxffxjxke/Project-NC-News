const db = require("../db/connection");

exports.fetchComments = (articleId) => {
  return db
    .query(
      `SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;`,
      [articleId]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertComment = (body, articleId, author) => {
  return db
    .query(
      `INSERT INTO comments
    (body, article_id, author, votes)
    VALUES
    ($1, $2, $3, $4)
    RETURNING *;`,
      [body, articleId, author, 0]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeComment = (commentId) => {
  return db
    .query(
      `DELETE FROM comments WHERE comment_id=$1
    RETURNING *;`,
      [commentId]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, message: "Comment not found" });
      }
      return rows[0];
    });
};

exports.checkCommentExists = (commentId) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1;`, [commentId])
    .then(({ rows: comment }) => {
      if (!comment.length) {
        return Promise.reject({ status: 404, message: "Comment not found" });
      }
    });
};

exports.updateComment = (commentId, changeVotes) => {
  return db
    .query(
      `UPDATE comments
  SET votes=votes + $1
  WHERE comment_id = $2
  RETURNING *;`,
      [changeVotes, commentId]
    )
    .then(({ rows }) => {
      if ( !rows.length )
      {
        return Promise.reject({ status: 404, message: "Comment not found" });
      }
      return rows[0];
    });
};
