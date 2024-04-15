const app = require("../db/app");
const db = require("../db/connection");
const data = require("../db/data/test-data/index");
const endpointsData = require("../endpoints.json");
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
        .then( ( { body } ) =>
        {
        expect(body).toEqual(endpointsData);
      });
  });
});

describe("/api/articles", () => {
  test("GET 200 - Responds with an article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchObject({
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
  test("GET 404 - Incorrect article id responds with article not found error", () => {
    return request(app)
      .get("/api/articles/500")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Article not found");
      });
  });
});
