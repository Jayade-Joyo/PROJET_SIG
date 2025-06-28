// backend/db/connect.js
const pgp = require('pg-promise')();
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'stations_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'mot de passe',
};

const db = pgp(dbConfig);

module.exports = db;