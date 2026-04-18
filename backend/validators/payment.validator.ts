function validateCreateOrder(req: any, res: any, next: any) {
  const { guest, showtime_id, seats, total_amount } = req.body;

  if (!total_amount) {
    return res.status(400).json({ message: 'Paisa deeeeee' });
  }

  if (!guest || !showtime_id || !seats || !Array.isArray(seats)) {
    return res.status(400).json({ message: 'Missing required booking fields' });
  }

  if (!guest.full_name || !guest.email || !guest.phone) {
    return res.status(400).json({ message: 'Missing guest details' });
  }

  next();
}

function validateVerifyPayment(req: any, res: any, next: any) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, booking_id } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !booking_id) {
    return res.status(400).json({ message: 'Missing payment verification fields' });
  }

  next();
}

module.exports = {
  validateCreateOrder,
  validateVerifyPayment,
};
