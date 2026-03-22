const express = require('express');
const { pool } = require('../src/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const router = express.Router();
const { authenticateToken } = require('../authentication/authentication'); // Correct import
const {checkRole} = require('../authentication/checkRole')
require('dotenv').config();
router.post('/addMovie', authenticateToken, checkRole, async (req:any, res:any, next:any) => {
  try {
    const { title, description, duration_minutes, genre, language, rated, release_date, img_link, writers, actors, country } = req.body;
    const added_by = req.user.username; // Get from decoded JWT
    if (!title || !description || !duration_minutes || !genre || !language || !rated || !release_date || !img_link) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pool.query(
      `INSERT INTO movies (title, description, duration_minutes, genre, language, rated, release_date, added_by, image, writers, actors, country)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING title, description, duration_minutes, genre, language, rated, release_date, added_by`,
      [title, description, duration_minutes, genre, language, rated, release_date, added_by, img_link, writers, actors, country]
    );

    res.status(200).json({ message: "Movie Added", movie: result.rows[0] });
  } catch (error) {
    console.error('Error adding movie:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/getMovie', async(req:any, res:any, next:any)=>{
    const result = await pool.query('SELECT * from movies where is_active=true');

    res.status(200).json({result: result.rows})
})

router.get('/getMovie/:movieId', async (req: any, res: any, next: any) => {
  try {
    const { movieId } = req.params;

    const result = await pool.query('SELECT * FROM movies WHERE movie_id = $1', [movieId]);

    const movie = result.rows[0];

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Check if the movie is inactive
    if (movie.is_active === false) {
      return res.status(403).json({ message: 'Movie is inactive' });
    }

    res.status(200).json({ result: movie });
  } 
  catch (err) {
    next(err);
  }
});


router.post('/deactivateMovie', authenticateToken, checkRole, async (req: any, res: any) => {
  try {
    const { movie_id } = req.body;

    if (!movie_id) {
      return res.status(400).json({ error: 'Missing movie_id' });
    }

    const result = await pool.query(
      'UPDATE movies SET is_active = false WHERE movie_id = $1',
      [movie_id]
    );

    // FIXED CONDITION
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.status(200).json({ message: 'Movie deactivated successfully' });
  } catch (error) {
    console.error('Error deactivating movie', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




module.exports = router;
