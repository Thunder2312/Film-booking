const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../authentication/authentication');
const { checkRole } = require('../authentication/checkRole');
const userController = require('../controllers/user.controller');
const { validateRegister, validateLogin, validateApproveUser } = require('../validators/user.validator');

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: [Admin]
 *     responses:
 *       200:
 *         description: List of all users
 *       500:
 *         description: Database error
 */
router.get('/', authenticateToken, checkRole, userController.getUsers);

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, full_name, email, phone, password]
 *             properties:
 *               username:
 *                 type: string
 *                 example: john_doe
 *               full_name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               password:
 *                 type: string
 *                 example: secret123
 *               role:
 *                 type: string
 *                 example: user
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post('/register', validateRegister, userController.register);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *                 example: john_doe
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Invalid username or password
 *       403:
 *         description: Awaiting admin approval
 *       500:
 *         description: Internal server error
 */
router.post('/login', validateLogin, userController.login);

/**
 * @swagger
 * /user/logout:
 *   delete:
 *     summary: Logout a user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.delete('/logout', userController.logout);

/**
 * @swagger
 * /user/approveUser:
 *   get:
 *     summary: Get all unapproved users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of unapproved users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
router.get('/approveUser', authenticateToken, checkRole, userController.getUnapprovedUsers);

/**
 * @swagger
 * /user/approveUser:
 *   post:
 *     summary: Approve a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user_id]
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Approval is done
 *       400:
 *         description: Missing user_id
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
router.post('/approveUser', authenticateToken, checkRole, validateApproveUser, userController.approveUser);

module.exports = router;
