/**
 * ─────────────────────────────────────────────────────────
 *  Environment-aware configuration loader
 * ─────────────────────────────────────────────────────────
 *  Loads the correct .env file based on NODE_ENV and
 *  exposes a strongly-typed config object used by every
 *  other module in the backend.
 */
const path = require('path');
const dotenv = require('dotenv');

// Determine which .env file to load
const NODE_ENV = process.env.NODE_ENV || 'development';
const envFile = `.env.${NODE_ENV}`;

// Load environment-specific file first, then fall back to .env
dotenv.config({ path: path.resolve(__dirname, '..', envFile) });
dotenv.config({ path: path.resolve(__dirname, '..', '.env') }); // fallback

const config = {
  /** Current environment: 'development' | 'production' */
  env: NODE_ENV,

  /** Express server settings */
  server: {
    port: Number(process.env.PORT) || 3000,
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  },

  /** PostgreSQL connection */
  db: {
    host: process.env.PGHOST || 'localhost',
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || '',
    database: process.env.PGDATABASE || 'filmZ',
    port: Number(process.env.PGPORT) || 5432,
  },

  /** JWT authentication */
  auth: {
    secretToken: process.env.SECRET_TOKEN || '',
    tokenExpiry: '15m',
  },

  /** Razorpay payment gateway */
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
  },
};

module.exports = config;
