const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../authentication/authentication');
const { checkRole } = require('../authentication/checkRole');
const showtimeController = require('../controllers/showtime.controller');
const { validateAddShowtime } = require('../validators/showtime.validator');

/**
 * @swagger
 * /showtimes/getMovieShowTimes/{movieId}:
 *   get:
 *     summary: Get showtimes for a specific movie
 *     tags: [Showtimes]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The movie ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date filter (defaults to today)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date filter (defaults to today)
 *     responses:
 *       200:
 *         description: Showtimes grouped by theater
 *       500:
 *         description: Internal server error
 */
router.get('/getMovieShowTimes/:movieId', showtimeController.getMovieShowTimes);

/**
 * @swagger
 * /showtimes/getDayShowTimes:
 *   get:
 *     summary: Get all showtimes for a date range
 *     tags: [Showtimes]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date filter (defaults to today)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date filter (defaults to today)
 *     responses:
 *       200:
 *         description: Showtimes grouped by theater and screen
 *       500:
 *         description: Internal server error
 */
router.get('/getDayShowTimes', showtimeController.getDayShowTimes);

/**
 * @swagger
 * /showtimes/addShowTimes:
 *   post:
 *     summary: Add a new showtime with seat pricing
 *     tags: [Showtimes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [movie_id, screen_id, start_time, end_time, seatTypes]
 *             properties:
 *               movie_id:
 *                 type: integer
 *                 example: 1
 *               screen_id:
 *                 type: integer
 *                 example: 3
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-04-20T14:00:00"
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-04-20T16:30:00"
 *               seatTypes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     seatType:
 *                       type: string
 *                       example: REGULAR
 *                     price:
 *                       type: number
 *                       example: 200
 *                     totalSeats:
 *                       type: integer
 *                       example: 60
 *     responses:
 *       200:
 *         description: Showtime added to theater
 *       400:
 *         description: Incomplete data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/addShowTimes', authenticateToken, checkRole, validateAddShowtime, showtimeController.addShowTime);

module.exports = router;
