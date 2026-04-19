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
            WHEN EXISTS (
                SELECT 1
                FROM booked_seats bs
                JOIN bookings b ON bs.booking_id = b.booking_id
                WHERE bs.seat_id = se.seat_id
                  AND b.showtime_id = st.showtime_id
                  AND b.payment_status = 'CONFIRMED'
            ) THEN 'BOOKED'
            ELSE 'AVAILABLE'
        END AS status
    FROM showtimes st
    JOIN screens s ON st.screen_id = s.screen_id
    JOIN seats se ON se.screen_id = s.screen_id
    JOIN showtime_prices sp 
        ON sp.showtime_id = st.showtime_id 
        AND sp.seat_type = se.seat_type
    WHERE st.showtime_id = $1
    ORDER BY se.seat_number;
  `, [showtimeId]);

  return result.rows;
}

module.exports = {
  getSeatsByShowtimeId,
};
