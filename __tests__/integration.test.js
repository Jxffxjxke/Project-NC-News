const app = require("../db/app");
const db = require("../db/connection");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const request = require("supertest");

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
      .then(({ body }) => {
        expect(body.message).toBe("URL not found");
      });
  });
});

describe("/api/topics", () => {
  test("GET 200 - Responds with all topics.", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        body.forEach((topic) => {
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
      .then(({ body }) => {
        expect(Object.keys(body)).toMatchObject([
          "GET /api",
          "GET /api/topics",
          "GET /api/articles",
        ]);
        for (const endpoint in body) {
          expect(Object.keys(body[endpoint])).toEqual([
            "description",
            "queries",
            "exampleResponse",
          ]);
        }
      });
  });
});
