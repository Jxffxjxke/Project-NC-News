const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
};

exports.checkTopicExists = (shouldCheck, topic) => {
  if (!shouldCheck) {
    return;
  }
  return db
    .query(`SELECT * FROM topics WHERE slug=$1;`, [topic])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, message: "Topic not found" });
      }
      return rows;
    });
};
