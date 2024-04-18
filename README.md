# Northcoders' News API

Hosted Link: https://project-nc-news-xdpp.onrender.com

Welcome to the Northcoders' News API! This API allows you to programmatically access application data, mimicking real working backend services like Reddit. Here, you can retrieve information about news articles.

### Requirements:

- [Node.js](https://nodejs.org/en/) v21.6.1
- [Postgres](https://www.postgresql.org/download/) v14.11

## Installation
```
-Clone this repository to your local machine.
-In the root of the folder, create two .env files: .env.test and .env.development.
-In each .env file, add the following:
[PGDATABASE=yout_test_database] // for .env.test
[PGDATABASE=your_dev_database] // for .env.development
-Run npm i to install all dependencies.
-Run npm setup-dbs to create the local databases.
-Seed the local database by running npm run seed.
-Finally, execute npm run test to run the test script.
```

This README is aimed at developers interested in exploring and potentially contributing to this project. Feel free to try it out and explore the functionalities!

If you have any questions or feedback, don't hesitate to reach out.
