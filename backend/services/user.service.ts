const { pool } = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');

async function getAllUsers() {
  const result = await pool.query('SELECT * from users');
  return result.rows;
}

async function createUser(data: {
  username: string;
  full_name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
}) {
  const requestTime = new Date();
  const istDateTime = requestTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(data.password, saltRounds);

  const result = await pool.query(
    `INSERT INTO users (username, full_name, email, phone, role, hash, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING user_id, username, full_name, email, phone, created_at`,
    [data.username, data.full_name, data.email, data.phone, data.role, hashedPassword, istDateTime]
  );

  return result.rows[0];
}

async function findByUsername(username: string) {
  const result = await pool.query('SELECT * from users where username=$1', [username]);
  return result.rows[0];
}

function generateAccessToken(user: { user_id: number; username: string }) {
  return jwt.sign(
    { user_id: user.user_id, username: user.username },
    config.auth.secretToken,
    { expiresIn: config.auth.tokenExpiry }
  );
}

async function getUnapprovedUsers() {
  const result = await pool.query('SELECT * FROM USERS where role_approval=false');
  return result.rows;
}

async function approveUser(user_id: number) {
  const result = await pool.query(
    'UPDATE users SET role_approval=true WHERE user_id=$1',
    [user_id]
  );
  return result;
}

module.exports = {
  getAllUsers,
  createUser,
  findByUsername,
  generateAccessToken,
  getUnapprovedUsers,
  approveUser,
};
