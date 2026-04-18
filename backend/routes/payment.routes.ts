const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { validateCreateOrder, validateVerifyPayment } = require('../validators/payment.validator');

/**
 * @swagger
 * /payment/create-order:
 *   post:
 *     summary: Create a booking and Razorpay order
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [guest, showtime_id, seats, total_amount]
 *             properties:
 *               guest:
 *                 type: object
 *                 required: [full_name, email, phone]
 *                 properties:
 *                   full_name:
 *                     type: string
 *                     example: Jane Doe
 *                   email:
 *                     type: string
 *                     example: jane@example.com
 *                   phone:
 *                     type: string
 *                     example: "9876543210"
 *               showtime_id:
 *                 type: integer
 *                 example: 5
 *               seats:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [101, 102, 103]
 *               total_amount:
 *                 type: number
 *                 example: 600.00
 *     responses:
 *       200:
 *         description: Razorpay order created with booking_id
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Booking failed
 */
router.post('/create-order', validateCreateOrder, paymentController.createOrder);

/**
 * @swagger
 * /payment/verify-payment:
 *   post:
 *     summary: Verify Razorpay payment signature
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [razorpay_order_id, razorpay_payment_id, razorpay_signature, booking_id]
 *             properties:
 *               razorpay_order_id:
 *                 type: string
 *                 example: order_abc123
 *               razorpay_payment_id:
 *                 type: string
 *                 example: pay_xyz456
 *               razorpay_signature:
 *                 type: string
 *                 example: abc123def456...
 *               booking_id:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       200:
 *         description: Payment verified and booking confirmed
 *       400:
 *         description: Invalid signature or missing fields
 *       500:
 *         description: DB update failed
 */
router.post('/verify-payment', validateVerifyPayment, paymentController.verifyPayment);

module.exports = router;
