const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../authentication/authentication');
const { checkRole } = require('../authentication/checkRole');
const screenController = require('../controllers/screen.controller');
const { validateGetScreens } = require('../validators/screen.validator');

/**
 * @swagger
 * /screens/getScreens/{theater_id}:
 *   get:
 *     summary: Get screens for a theater
 *     tags: [Screens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: theater_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The theater ID
 *     responses:
 *       200:
 *         description: List of screens for the theater
 *       400:
 *         description: Invalid theater_id
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/getScreens/:theater_id', authenticateToken, checkRole, validateGetScreens, screenController.getScreens);

module.exports = router;
