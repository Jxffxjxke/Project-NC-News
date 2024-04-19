const db = require("../db/connection");

exports.fetchArticle = (articleId) => {
  return db
    .query(
      `SELECT articles.*, 
      CAST(COUNT(comments.article_id) AS INTEGER) AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;`,
      [articleId]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, message: "Article not found" });
      }
      return rows[0];
    });
};

exports.fetchArticles = (filter, query) => {
  const filterBy = ["topic"];
  const queryVals = [];

  let queryString = `SELECT
  a.author,
  a.title,
  a.article_id,
  a.topic,
  a.created_at,
  a.votes,
  a.article_img_url,
  COALESCE(CAST(c.comment_count AS INTEGER), 0) AS comment_count
  FROM articles a
  LEFT JOIN (
    SELECT article_id, COUNT(comment_id) AS comment_count
    FROM comments GROUP BY article_id)
    c ON a.article_id = c.article_id `;

  if (filterBy.includes(filter)) {
    queryVals.push(query);
    queryString += `WHERE ${filter}=$1 `;
  }
  queryString += `ORDER BY created_at DESC;`;

  return db.query(queryString, queryVals).then(({ rows }) => {
    return rows;
  });
};

exports.checkArticleExists = (articleId) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1;`, [articleId])
    .then(({ rows: article }) => {
      if (!article.length) {
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
