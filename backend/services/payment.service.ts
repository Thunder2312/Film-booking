const { pool } = require('../config/db');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const config = require('../config');
const { generateQRCode } = require("../utils/qrcode");
const { sendEmail } = require("../services/email.service");

const razorpay = new Razorpay({
  key_id: config.razorpay.keyId,
  key_secret: config.razorpay.keySecret,
});

async function createOrder(data: {
  guest: { full_name: string; email: string; phone: string };
  showtime_id: number;
  seats: number[];
  total_amount: number;
}) {
  const { guest, showtime_id, seats, total_amount } = data;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 0. Check Availability and Recalculate Price securely
    const checkRes = await client.query(
      `SELECT bs.seat_id FROM booked_seats bs
       JOIN bookings b ON bs.booking_id = b.booking_id
       WHERE b.showtime_id = $1 AND bs.seat_id = ANY($2) AND b.payment_status = 'CONFIRMED'`,
      [showtime_id, seats]
    );
    if (checkRes.rows.length > 0) {
      throw new Error('One or more selected seats are already booked.');
    }

    let calculated_total = 0;
    for (const seatId of seats) {
      const priceRes = await client.query(
        `SELECT price FROM showtime_prices WHERE showtime_id = $1 AND seat_type = (SELECT seat_type FROM seats WHERE seat_id = $2)`,
        [showtime_id, seatId]
      );
      if (priceRes.rows.length === 0) {
        throw new Error(`Price not found for seat ID: ${seatId}`);
      }
      calculated_total += Number(priceRes.rows[0].price);
    }

    // 1. Insert Guest
    const guestRes = await client.query(
      'INSERT INTO guests (full_name, email, phone) VALUES ($1, $2, $3) RETURNING guest_id',
      [guest.full_name, guest.email, guest.phone]
    );
    const guestId = guestRes.rows[0].guest_id;

    // 2. Create Pending Booking with securely calculated total
    const bookingRes = await client.query(
      `INSERT INTO bookings (guest_id, showtime_id, total_amount, payment_status)
       VALUES ($1, $2, $3, 'PENDING') RETURNING booking_id`,
      [guestId, showtime_id, calculated_total]
    );
    const bookingId = bookingRes.rows[0].booking_id;

    // 3. Insert Booked Seats
    for (const seatId of seats) {
      await client.query(
        'INSERT INTO booked_seats (booking_id, seat_id, price) VALUES ($1, $2, (SELECT price FROM showtime_prices WHERE showtime_id = $3 AND seat_type = (SELECT seat_type FROM seats WHERE seat_id = $2)))',
        [bookingId, seatId, showtime_id]
      );
    }

    // 4. Create Razorpay Order securely
    const order = await razorpay.orders.create({
      amount: Math.round(calculated_total * 100),
      currency: "INR",
      receipt: `booking_${bookingId}`,
    });

    await client.query('COMMIT');
    return { ...order, booking_id: bookingId };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
async function verifyPayment(data: { razorpay_order_id: any; razorpay_payment_id: any; razorpay_signature: any; booking_id: any; }) {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    booking_id,
  } = data;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSign = crypto
    .createHmac("sha256", config.razorpay.keySecret)
    .update(sign)
    .digest("hex");

  if (razorpay_signature !== expectedSign) {
    return { valid: false };
  }

  // Get show + screen + movie
  const infoRes = await pool.query(
    `
    SELECT 
      b.booking_id,
      sc.name AS screen_name,
      s.start_time,
      m.title AS movie_title
    FROM bookings b
    JOIN showtimes s ON s.showtime_id = b.showtime_id
    JOIN screens sc ON sc.screen_id = s.screen_id
    JOIN movies m ON m.movie_id = s.movie_id
    WHERE b.booking_id = $1
    `,
    [booking_id]
  );

  // Get seats
  const seatsRes = await pool.query(
    `
    SELECT se.seat_number
    FROM booked_seats bs
    JOIN seats se ON se.seat_id = bs.seat_id
    WHERE bs.booking_id = $1
    `,
    [booking_id]
  );

  const info = infoRes.rows[0];
  const seats = seatsRes.rows.map((s: { seat_number: any; }) => s.seat_number);

  // update booking
  await pool.query(
    `UPDATE bookings SET payment_status = 'SUCCESS' WHERE booking_id = $1`,
    [booking_id]
  );

  // build QR payload
  const qrPayload = {
    booking_id: info.booking_id,
    movie_title: info.movie_title,
    screen_name: info.screen_name,
    show_date: info.start_time.toISOString().split("T")[0],
    show_time: info.start_time.toTimeString().split(" ")[0],
    seats: seats,
  };

  const qrCode = await generateQRCode(qrPayload);

  // 🎯 Send email
  await sendEmail({
    to: info.email, // make sure you fetched this
    templateId: "TICKET_CONFIRMATION",
    variables: {
      movie: info.movie_title,
      screen: info.screen_name,
      date: qrPayload.show_date,
      time: qrPayload.show_time,
      seats: seats.join(", "),
      bookingId: info.booking_id,
      qrCode: qrCode, // 👈 important
    },
  });

  return {
    valid: true,
    qrCode,
    ticket: qrPayload,
  };
}

module.exports = { createOrder, verifyPayment };
