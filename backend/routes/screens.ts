const express = require('express');
const { pool } = require('../src/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const router = express.Router();
const { authenticateToken } = require('../authentication/authentication'); // Correct import
const {checkRole} = require('../authentication/checkRole')
require('dotenv').config();

router.get('/getScreens/:theater_id', authenticateToken, checkRole, async(req:any, res:any)=>{
    const theater_id = parseInt(req.params.theater_id, 10);

    if (isNaN(theater_id)) {
        return res.status(400).json({ error: 'Invalid theater_id' });
    }
    const result = await pool.query('SELECT * from  screens where theater_id=$1 ORDER BY NAME',[Number(theater_id)]);
    res.status(200).json({result: result.rows})
})



module.exports = router;