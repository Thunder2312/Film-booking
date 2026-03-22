const express = require('express');
const { pool } = require('../src/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const router = express.Router();
const { authenticateToken } = require('../authentication/authentication'); // Correct import
const {checkRole} = require('../authentication/checkRole')
require('dotenv').config();

router.get('/getMovieShowTimes/:movieId', async (req: any, res: any) => {
    try {
    const {movieId} = req.params;
    let { startDate, endDate } = req.query;

    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

    startDate = startDate || today;
    endDate   = endDate   || today;

    const sql = `
    SELECT 
    t.theater_id,
    t.name AS theater_name,
    t.location AS theater_location,
    
    JSON_AGG(
        JSON_BUILD_OBJECT(
            'showtime_id', st.showtime_id,
            'screen', s.name,
            'start_time', st.start_time,
            'end_time', st.end_time
        )
        ORDER BY st.start_time
    ) AS showtimes

FROM showtimes st
JOIN movies m ON st.movie_id = m.movie_id
JOIN screens s ON st.screen_id = s.screen_id
JOIN theaters t ON s.theater_id = t.theater_id

WHERE st.start_time::date >= $1::date
  AND st.start_time::date <= $2::date
  AND st.movie_id = $3
    
GROUP BY 
    t.theater_id, t.name, t.location

ORDER BY t.name;
    `;

    const result = await pool.query(sql, [startDate, endDate, movieId]);

    res.json(result.rows);
} catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
}

});


router.get('/getDayShowTimes', async (req: any, res: any) => {
    try {
    let { startDate, endDate } = req.query;

    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

    startDate = startDate || today;
    endDate   = endDate   || today;

    const sql = `
    SELECT 
    t.theater_id,
    t.name AS theater_name,
    t.location AS theater_location,
    
    s.screen_id,
    s.name AS screen_name,
    JSON_AGG(
        JSON_BUILD_OBJECT(
            'showtime_id', st.showtime_id,
            'movie_name', m.title,
            'start_time', st.start_time,
            'end_time', st.end_time
        )
        ORDER BY st.start_time
    )AS showtimes

    FROM showtimes st
    JOIN movies m ON st.movie_id = m.movie_id
    JOIN screens s ON st.screen_id = s.screen_id
    JOIN theaters t ON s.theater_id = t.theater_id

    WHERE st.start_time >= $1::timestamp
    AND st.start_time < ($2::timestamp + INTERVAL '1 day')
    
    GROUP BY 
    t.theater_id, t.name, t.location,
    s.screen_id, s.name

    ORDER BY t.name, s.name
    `;

    const result = await pool.query(sql, [startDate, endDate]);

    res.json(result.rows);
} catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
}

});


router.post('/addShowTimes', authenticateToken, checkRole, async(req:any, res:any)=>{
    try{
        const {movie_id, screen_id, start_time, end_time, seatTypes} = req.body;
        if(!movie_id || !screen_id || !start_time ||!end_time || !Array.isArray(seatTypes)){
            return res.status(400).json({ message: "Incomplete data sent from request" });
        }
        const showtimeResult = await pool.query(
            "INSERT INTO showtimes (movie_id, screen_id, start_time, end_time) VALUES($1, $2, $3, $4) returning showtime_id",
            [movie_id, screen_id, start_time, end_time]
          );
          
          const showtimeId = showtimeResult.rows[0].showtime_id;      

        for(const seat of seatTypes){
            const {seatType, price} = seat;
            if(!seatType || !price) continue;

            await pool.query(
                `INSERT INTO showtime_prices (showtime_id, seat_type, price)
                VALUES ($1,$2,$3)`,
                [showtimeId, seatType.toUpperCase(), price]
            )
        }

        const existingSeats = await pool.query(
            `SELECT COUNT(*) from seats WHERE screen_id = $1`,
            [screen_id]
        )
       
        if(Number(existingSeats.rows[0].count) === 0){
            const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            let rowIndex = 0;

            const seatsPerRow = 10;

            for(const seat of seatTypes){
                let remainingSeats = seat.totalSeats;
            
                while(remainingSeats>0){
                    const rowLetter = letters[rowIndex++];

                    const seatsInThisRow = Math.min(seatsPerRow, remainingSeats);

                    for(let i=1;i<=seatsInThisRow;i++){
                        const seatNumber = `${rowLetter}${String(i).padStart(2, '0')}`;

                    await pool.query(
                        `INSERT INTO seats(screen_id, seat_number, seat_type, is_active)
                            VALUES($1,$2,$3,$4)`,
                            [screen_id, seatNumber, seat.seatType.toUpperCase(), true]
                    )
                    }
                    remainingSeats -= seatsInThisRow;
                }
            }
        }
        return res.status(200).json({message: "Showtime added to theater"})
    }catch(error){
        return res.status(500).json({message: "Server Error"})
    }
})


module.exports = router;