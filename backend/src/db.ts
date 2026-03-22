const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: Number(process.env.PGPORT),
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL');
});

pool.on('error', (err:any) => {
  console.error('PostgreSQL connection error:', err);
});

module.exports = { pool };