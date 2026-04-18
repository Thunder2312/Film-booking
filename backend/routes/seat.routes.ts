const express = require('express');
const router = express.Router();
const seatController = require('../controllers/seat.controller');

/**
 * @swagger
 * /seats/getSeats/{showtimeId}:
 *   get:
 *     summary: Get seats with booking status for a showtime
 *     tags: [Seats]
 *     parameters:
 *       - in: path
 *         name: showtimeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The showtime ID
 *     responses:
 *       200:
 *         description: List of seats with availability status and prices
 *       500:
 *         description: Internal server error
 */
router.get('/getSeats/:showtimeId', seatController.getSeats);

module.exports = router;
