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
