const app = require("../db/app");
const db = require("../db/connection");
const data = require("../db/data/test-data/index");
const endpointsData = require("../endpoints.json");
const seed = require("../db/seeds/seed");
const request = require("supertest");
require("jest-sorted");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("Any incorrect URL", () => {
  test("ANY 404: For incorrect URL input, responds with a bad request error", () => {
    return request(app)
      .get("/api/wrong_URL")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("URL not found");
      });
  });
});

describe("/api/topics", () => {
  test("GET 200 - Responds with all topics.", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        topics.forEach((topic) => {
          expect(typeof topic.description).toBe("string");
          expect(typeof topic.slug).toBe("string");
        });
      });
  });
});

describe("/api", () => {
  test("GET 200 - Responds with all api endpoints and information about them.", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsData);
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET 200 - Responds with an article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("GET 404 - Responds with article not found if valid article id not-existent", () => {
    return request(app)
      .get("/api/articles/500")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Article not found");
      });
  });
  test("GET 400 - Responds with bad request error if article id is invalid", () => {
    return request(app)
      .get("/api/articles/NaN")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
  test("PATCH 200 - Responds with the updated article and the votes count changed by given amount", () => {
    const send = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/1")
      .send(send)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 101,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("PATCH 404 - Respond with not found error if article id is not found", () => {
    const send = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/500")
      .send(send)
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Article not found");
      });
  });
  test("PATCH 400 - Responds with bad request error if article id is invalid", () => {
    const send = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/NaN")
      .send(send)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
  test("PATCH 400 - Responds with bad request error if inc_votes key is not provided", () => {
    const send = { not_key: 1 };
    return request(app)
      .patch("/api/articles/1")
      .send(send)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
  test("PATCH 400 - Responds with bad request error if votes is invalid", () => {
    const send = { inc_votes: "NaN" };
    return request(app)
      .patch("/api/articles/1")
      .send(send)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
});

describe("/api/articles", () => {
  test("GET 200 - Responds with an array of all articles and the comment counts of each", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article) => {
          if (article.comment_count !== null) {
            expect(parseInt(article.comment_count)).toEqual(expect.any(Number));
          }
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET 200 - Responds with an array of comments from given article id in descending order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(11);
        expect(comments).toBeSortedBy("created_at", { descending: true });
        comments.forEach((comment) => {
          expect(Object.keys(comment)).toEqual([
            "comment_id",
            "body",
            "article_id",
            "author",
            "votes",
            "created_at",
          ]);
        });
      });
  });
  test("GET 200 - Responds with an empty array if there are no comments from article id", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
      });
  });
  test("GET 404 - Responds with not found error if id is valid but not in database", () => {
    return request(app)
      .get("/api/articles/500/comments")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Article not found");
      });
  });
  test("GET 400 - Responds with bad request error if id is invalid", () => {
    return request(app)
      .get("/api/articles/NaN/comments")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
  test("POST 201 - Adds given comment to given article where author is given username, responds with added comment", () => {
    const newComment = {
      body: "Comment",
      author: "lurker",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          comment_id: 19,
          body: "Comment",
          article_id: 1,
          author: "lurker",
          votes: 0,
        });
      });
  });
  test("POST 400 - Responds with a bad request error when request format is invalid", () => {
    const newComment = {
      not_body: "Comment",
      author: "lurker",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
  test("POST 404 - Responds with author not found when author is non-existent", () => {
    const newComment = {
      body: "Comment",
      author: "Author",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Author not found");
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test("DELETE 204 - Deletes comment with given id and responds with 204 status code", () => {
    const testId = 1;
    return request(app)
      .delete(`/api/comments/${testId}`)
      .expect(204)
      .then(() => {
        return db
          .query(`SELECT * FROM comments WHERE comment_id=$1;`, [testId])
          .then(() => {
            return db
              .query(
                `SELECT * FROM comments
      WHERE comment_id=$1;`,
                [testId]
              )
              .then(({ rows }) => {
                expect(rows.length).toBe(0);
              });
          });
      });
  });
  test("DELETE 404 - Responds with a 404 comment not found error if comment id is non-existent", () => {
    return request(app)
      .delete("/api/comments/500")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Comment not found");
      });
  });
  test("DELETE 400 - Responds with a 400 bad request when id is invalid", () => {
    return request(app)
      .delete("/api/comments/NaN")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
});

describe("/api/users", () => {
  test("GET 200 - Responds with an array of all user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
        return db.query(`SELECT * FROM users;`).then(({ rows }) => {
          expect(rows.length).toBe(users.length);
        });
      });
  });
});
