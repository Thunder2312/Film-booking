const { pool } = require('../config/db');

async function getSeatsByShowtimeId(showtimeId: number) {
  const result = await pool.query(`
    SELECT 
        se.seat_id AS seat_id,
        s.name AS screen_name,
        se.seat_number,
        se.seat_type,
        sp.price,
        CASE
            WHEN b.booking_id IS NOT NULL THEN 'BOOKED'
            ELSE 'AVAILABLE'
        END AS status
    FROM showtimes st
    JOIN screens s ON st.screen_id = s.screen_id
    JOIN seats se ON se.screen_id = s.screen_id
    JOIN showtime_prices sp 
        ON sp.showtime_id = st.showtime_id 
        AND sp.seat_type = se.seat_type
    LEFT JOIN booked_seats bs 
        ON bs.seat_id = se.seat_id
    LEFT JOIN bookings b 
        ON b.booking_id = bs.booking_id 
        AND b.showtime_id = st.showtime_id
        AND b.payment_status = 'CONFIRMED'
    WHERE st.showtime_id = $1
    ORDER BY se.seat_number;
  `, [showtimeId]);

  return result.rows;
}

module.exports = {
  getSeatsByShowtimeId,
};
