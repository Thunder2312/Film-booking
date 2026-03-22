require('dotenv').config({ path: require('path').resolve(__dirname, './.env') });
const express = require('express');
const userRoutes = require('./routes/app');
const cors = require('cors');
const app = express();
const seatRoutes = require('./routes/seats');
const movieRoutes = require('./routes/movies')
const theaterRoutes = require('./routes/theater')
const showtimeRoutes = require('./routes/showtimes')
const screenRoutes = require('./routes/screens');
const { pool } = require('./src/db');

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1); // Force a non-zero exit code so nodemon shows the error
});
// Option 1: Allow a specific origin
app.use(cors({
  origin: 'http://localhost:4200', // Angular app URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


pool.query('SELECT NOW()', (err: any, res: any) => {
  if (err) {
    console.error('Database connection failed at startup:', err.message);
    process.exit(1);
  } else {
    console.log('Database connectivity verified');
  }
});

app.use(express.json());
const PORT = process.env.PORT || 3000;

// Mount routes
app.use('/user', userRoutes);
app.use('/movies', movieRoutes);
app.use('/theaters', theaterRoutes);
app.use('/showtimes', showtimeRoutes);
app.use('/screens', screenRoutes);
app.use('/seats', seatRoutes);
// Start the server
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
