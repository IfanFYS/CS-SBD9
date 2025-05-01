const { Pool } = require('pg');
require('dotenv').config();

// Use either DATABASE_URL (for Render) or PG_CONNECTION_STRING for local development
const connectionString = process.env.DATABASE_URL || process.env.PG_CONNECTION_STRING;

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false // For render deployment
  }
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Database connected successfully at:', res.rows[0].now);
  }
});

module.exports = pool;