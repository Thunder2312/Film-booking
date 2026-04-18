const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../authentication/authentication');
const { checkRole } = require('../authentication/checkRole');
const movieController = require('../controllers/movie.controller');
const { validateAddMovie, validateDeactivateMovie } = require('../validators/movie.validator');

/**
 * @swagger
 * /movies/addMovie:
 *   post:
 *     summary: Add a new movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, duration_minutes, genre, language, rated, release_date, img_link]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Inception
 *               description:
 *                 type: string
 *                 example: A mind-bending thriller
 *               duration_minutes:
 *                 type: integer
 *                 example: 148
 *               genre:
 *                 type: string
 *                 example: Sci-Fi
 *               language:
 *                 type: string
 *                 example: English
 *               rated:
 *                 type: string
 *                 example: PG-13
 *               release_date:
 *                 type: string
 *                 format: date
 *                 example: "2010-07-16"
 *               img_link:
 *                 type: string
 *                 example: https://image.url/inception.jpg
 *               writers:
 *                 type: string
 *                 example: Christopher Nolan
 *               actors:
 *                 type: string
 *                 example: Leonardo DiCaprio, Tom Hardy
 *               country:
 *                 type: string
 *                 example: USA
 *     responses:
 *       200:
 *         description: Movie added successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/addMovie', authenticateToken, checkRole, validateAddMovie, movieController.addMovie);

/**
 * @swagger
 * /movies/getMovie:
 *   get:
 *     summary: Get all active movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: List of active movies
 *       500:
 *         description: Internal server error
 */
router.get('/getMovie', movieController.getMovies);

/**
 * @swagger
 * /movies/getMovie/{movieId}:
 *   get:
 *     summary: Get a movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The movie ID
 *     responses:
 *       200:
 *         description: Movie details
 *       403:
 *         description: Movie is inactive
 *       404:
 *         description: Movie not found
 */
router.get('/getMovie/:movieId', movieController.getMovieById);

/**
 * @swagger
 * /movies/deactivateMovie:
 *   post:
 *     summary: Deactivate a movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [movie_id]
 *             properties:
 *               movie_id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Movie deactivated successfully
 *       400:
 *         description: Missing movie_id
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal server error
 */
router.post('/deactivateMovie', authenticateToken, checkRole, validateDeactivateMovie, movieController.deactivateMovie);

module.exports = router;
