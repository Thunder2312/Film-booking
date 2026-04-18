const { pool } = require('../config/db');

async function getAllTheaters() {
  const result = await pool.query('SELECT * FROM theaters');
  return result.rows;
}

async function getTheaterNames() {
  const result = await pool.query(
    'SELECT theater_id, name FROM theaters ORDER BY name'
  );
  return result.rows;
}

async function addTheater(data: {
  name: string;
  location: string;
  total_screens: number;
  city: string;
}) {
  const result = await pool.query(
    'INSERT INTO theaters (name, location, total_screens, city) VALUES ($1, $2, $3, $4) RETURNING name, location, total_screens, city',
    [data.name, data.location, data.total_screens, data.city]
  );
  return result.rows[0];
}

async function removeTheater(theater_id: number) {
  const result = await pool.query('DELETE from theaters where theater_id=$1', [theater_id]);
  return result;
}

module.exports = {
  getAllTheaters,
  getTheaterNames,
  addTheater,
  removeTheater,
};
