const { Pool } = require('pg');
const config = require('./index');

const pool = new Pool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  port: config.db.port,
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL');
});

pool.on('error', (err: any) => {
  console.error('PostgreSQL connection error:', err);
});

module.exports = { pool };
