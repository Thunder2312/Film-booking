const paymentService = require('../services/payment.service');

async function createOrder(req: any, res: any) {
  try {
    const { guest, showtime_id, seats, total_amount } = req.body;
    const result = await paymentService.createOrder({ guest, showtime_id, seats, total_amount });
    res.json(result);
  } catch (error: any) {
    console.error("ERROR DETAILS:", error);
    res.status(500).json({ error: error.message || 'Booking failed' });
  }
}

async function verifyPayment(req: any, res: any) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, booking_id } = req.body;

    const result = await paymentService.verifyPayment({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      booking_id,
    });

    if (result.valid) {
      return res.status(200).json({ message: 'Payment verified and booking confirmed!' });
    } else {
      return res.status(400).json({ message: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Database Error during verification:', error);
    return res.status(500).json({ message: 'Payment verified but DB update failed.' });
  }
}

module.exports = {
  createOrder,
  verifyPayment,
};
