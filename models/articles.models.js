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

exports.fetchArticles = (topic, sortBy = "created_at", order = "desc") => {
  const validQuery = [
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "article_img_url",
    "article_id",
    "comment_count",
    "asc",
    "desc",
  ];

  if (!validQuery.includes(sortBy) || !validQuery.includes(order)) {
    return Promise.reject({ status: 400, message: "invalid query" });
  }
  const queryVals = [];

  let queryString = `SELECT 
  articles.author,
  title,
  articles.article_id,
  topic,
  articles.created_at,
  articles.votes,
  articles.article_img_url,
  COUNT(comment_id)::int AS comment_count
  FROM articles LEFT JOIN comments 
  ON articles.article_id = comments.article_id
  GROUP BY articles.article_id`;

  if (topic) {
    queryVals.push(topic);
    queryString += ` HAVING articles.topic = $1 `;
  }
  queryString += ` ORDER BY ${sortBy} ${order};`;

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
