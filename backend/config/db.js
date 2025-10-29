// config/db.js
const { Pool } = require('pg');

const user = process.env.DB_USER || 3000;
const host = process.env.DB_HOST || 3000;
const database = process.env.DB_DATABASE || 3000;
const password = process.env.DB_PASSWORD || 3000;
const port = process.env.PORT || 3000;

const pool = new Pool({
  user: user,
  host: host,
  database: database,
  password: password,
  port: port,
});

module.exports = pool;