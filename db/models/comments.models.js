const db = require("../connection");

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
