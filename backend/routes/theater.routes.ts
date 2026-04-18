const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../authentication/authentication');
const { checkRole } = require('../authentication/checkRole');
const theaterController = require('../controllers/theater.controller');
const { validateAddTheater, validateRemoveTheater } = require('../validators/theater.validator');

/**
 * @swagger
 * /theaters/getTheater:
 *   get:
 *     summary: Get all theaters with full details
 *     tags: [Theaters]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all theaters
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/getTheater', authenticateToken, checkRole, theaterController.getTheaters);

/**
 * @swagger
 * /theaters/theaters:
 *   get:
 *     summary: Get theater names (for dropdowns)
 *     tags: [Theaters]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of theater_id and name pairs
 *       401:
 *         description: Unauthorized
 */
//using this for showtimes
router.get('/theaters', authenticateToken, checkRole, theaterController.getTheaterNames);

/**
 * @swagger
 * /theaters/addTheater:
 *   post:
 *     summary: Add a new theater
 *     tags: [Theaters]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, location, total_screens, city]
 *             properties:
 *               name:
 *                 type: string
 *                 example: PVR Cinemas
 *               location:
 *                 type: string
 *                 example: Phoenix Mall, Lower Parel
 *               total_screens:
 *                 type: integer
 *                 example: 5
 *               city:
 *                 type: string
 *                 example: Mumbai
 *     responses:
 *       201:
 *         description: Theater created successfully
 *       400:
 *         description: Incomplete data
 *       500:
 *         description: Server error
 */
router.post('/addTheater', authenticateToken, checkRole, validateAddTheater, theaterController.addTheater);

/**
 * @swagger
 * /theaters/removeTheater:
 *   delete:
 *     summary: Remove a theater
 *     tags: [Theaters]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [theater_id]
 *             properties:
 *               theater_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Theater removed
 *       400:
 *         description: Theater id missing
 *       500:
 *         description: Server error
 */
router.delete('/removeTheater', authenticateToken, checkRole, validateRemoveTheater, theaterController.removeTheater);

module.exports = router;
