const db = require("../db/connection");

exports.checkUsernameExists = (author) => {
  return db
    .query(`SELECT * FROM users WHERE username=$1;`, [author])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, message: "Author not found" });
      }
    });
};

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchUser = (username) => {
  return db
    .query(
      `SELECT * FROM users
  WHERE username=$1`,
      [username]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, message: "Username not found" });
      }
      return rows[0];
    });
};
