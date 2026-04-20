// Load environment config first — must be before any other import
const config = require('./config');

const express = require('express');
const cors = require('cors');
const app = express();
const { pool } = require('./config/db');
const { swaggerUi, swaggerSpec } = require('./config/swagger');

// Route imports
const userRoutes = require('./routes/user.routes');
const movieRoutes = require('./routes/movie.routes');
const theaterRoutes = require('./routes/theater.routes');
const showtimeRoutes = require('./routes/showtime.routes');
const screenRoutes = require('./routes/screen.routes');
const seatRoutes = require('./routes/seat.routes');
const paymentRoutes = require('./routes/payment.routes');
const emailRoutes = require("./routes/email.routes");


process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Add this BEFORE your routes!
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
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

// Swagger API docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/email", emailRoutes);


const PORT = config.server.port;

// Mount routes
app.use('/user', userRoutes);
app.use('/movies', movieRoutes);
app.use('/theaters', theaterRoutes);
app.use('/showtimes', showtimeRoutes);
app.use('/screens', screenRoutes);
app.use('/seats', seatRoutes);
app.use('/payment', paymentRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`[${config.env}] Server running on http://localhost:${PORT}`);
  console.log(`[${config.env}] API docs available at http://localhost:${PORT}/api-docs`);
});
