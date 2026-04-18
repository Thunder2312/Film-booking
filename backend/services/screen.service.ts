const { pool } = require('../config/db');

async function getScreensByTheaterId(theater_id: number) {
  const result = await pool.query(
    'SELECT * from screens where theater_id=$1 ORDER BY NAME',
    [theater_id]
  );
  return result.rows;
}

module.exports = {
  getScreensByTheaterId,
};
