const { pool } = require('../config/db');

async function addMovie(data: {
  title: string;
  description: string;
  duration_minutes: number;
  genre: string;
  language: string;
  rated: string;
  release_date: string;
  img_link: string;
  writers: string;
  actors: string;
  country: string;
  added_by: string;
}) {
  const result = await pool.query(
    `INSERT INTO movies (title, description, duration_minutes, genre, language, rated, release_date, added_by, image, writers, actors, country)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     RETURNING title, description, duration_minutes, genre, language, rated, release_date, added_by`,
    [
      data.title, data.description, data.duration_minutes, data.genre,
      data.language, data.rated, data.release_date, data.added_by,
      data.img_link, data.writers, data.actors, data.country,
    ]
  );
  return result.rows[0];
}

async function getActiveMovies() {
  const result = await pool.query('SELECT * from movies where is_active=true');
  return result.rows;
}

async function getMovieById(movieId: number) {
  const result = await pool.query('SELECT * FROM movies WHERE movie_id = $1', [movieId]);
  return result.rows[0];
}

async function deactivateMovie(movie_id: number) {
  const result = await pool.query(
    'UPDATE movies SET is_active = false WHERE movie_id = $1',
    [movie_id]
  );
  return result.rowCount;
}

module.exports = {
  addMovie,
  getActiveMovies,
  getMovieById,
  deactivateMovie,
};
