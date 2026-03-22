const express = require('express');
const { pool } = require('../src/db');
const router = express.Router();
require('dotenv').config();

router.get('/getSeats/:showtimeId', async (req: any, res: any) => {
    try {
        const { showtimeId } = req.params;

        const result = await pool.query(`
            SELECT 
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
                AND b.showtime_id = st.showtime_id  -- CRITICAL: Must match showtime
                AND b.payment_status = 'SUCCESS'
            WHERE st.showtime_id = $1
            ORDER BY se.seat_number;
        `, [showtimeId]);

        // Always send a response! 
        res.status(200).json({ result: result.rows });
    }
    catch (error) {
        console.error('Error getting seats:', error);
        // If you don't send a response on error, the client hangs
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;