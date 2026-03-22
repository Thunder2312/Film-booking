const express = require('express');
const { pool } = require('../src/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const router = express.Router();
const { authenticateToken } = require('../authentication/authentication'); // Correct import
const {checkRole} = require('../authentication/checkRole')
require('dotenv').config();

router.get('/getTheater', authenticateToken, checkRole, async(req:any, res:any)=>{
    const result = await pool.query('SELECT * FROM theaters');
     res.status(200).json({result: result.rows})
})

//using this for showtimes
router.get('/theaters', authenticateToken, checkRole, async (req:any, res:any) => {
  const result = await pool.query(
    'SELECT theater_id, name FROM theaters ORDER BY name'
  );

  res.status(200).json(result.rows);
});


router.post('/addTheater', authenticateToken, checkRole, async (req: any, res: any) => {
    try {
        const { name, location, total_screens, city } = req.body;

        if (!name || !location || !total_screens || !city) {
            return res.status(400).json({ message: "Incomplete data sent from request" });
        }

        const result = await pool.query
        (
        'INSERT INTO theaters (name, location, total_screens, city) VALUES ($1, $2, $3, $4) RETURNING name, location, total_screens, city',
            [name, location, total_screens, city]
        );

return res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
});


router.delete('/removeTheater', authenticateToken, checkRole, async(req:any, res:any)=>{
    try{
        const {theater_id} = req.body;
        if(!theater_id){
            return res.status(400).json({message: "Theater id missing"});
        }
        const result = await pool.query('DELETE from theaters where theater_id=$1', [theater_id]);
        return res.status(200).json({message: "Theater removed"});
    }
    catch(error){
        return res.status(500).json({message: "Server Error"});
    }
})

module.exports = router;