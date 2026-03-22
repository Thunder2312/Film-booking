const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const { pool } = require('../src/db');
require('dotenv').config();

async function checkRole(req: any, res: any, next: any) {
    try {
        // req.user is already populated by authenticateToken middleware
        if (!req.user || !req.user.username) {
            return res.status(401).json({ message: 'User info missing' });
        }

        const result = await pool.query(`SELECT role_approval from users where username=$1`, [req.user.username]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        if (result.rows[0].role_approval !== true) {
            return res.status(403).json({ message: 'Access denied: Admin approval required' });
        }
        next();
    } catch (error: any) {
        console.error('Error in checkRole:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = {checkRole};