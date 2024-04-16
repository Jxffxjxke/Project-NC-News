const db = require("../connection");

exports.fetchArticle = (articleId) => {
  return db
    .query(
      `SELECT * FROM articles
    WHERE article_id = $1;`,
      [articleId]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, message: "Article not found" });
      }
      return rows[0];
    });
};

exports.fetchArticles = () => {
  return db
    .query(
      `
  SELECT
  a.author,
  a.title,
  a.article_id,
  a.topic,
  a.created_at,
  a.votes,
  a.article_img_url,
  c.comment_count
  FROM articles a
  LEFT JOIN (
    SELECT article_id, COUNT(comment_id) AS comment_count
    FROM comments GROUP BY article_id)
    c ON a.article_id = c.article_id
    ORDER BY created_at DESC;`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.checkArticleExists = (articleId) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1;`, [articleId])
    .then(({ rows: articles }) => {
      if (!articles.length) {
        return Promise.reject({ status: 404, message: "Article not found" });
      }
    });
};

exports.updateVotes = (article_id, changeVotes) => {
  return db
    .query(
      `UPDATE articles
    SET votes = votes + $1
    WHERE article_id=$2
    RETURNING *;`,
      [changeVotes, article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, message: "Article not found" });
      }
      return rows[0];
    });
};
