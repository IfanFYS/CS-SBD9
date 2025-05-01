require('dotenv').config();
const express = require('express');
const fs = require('fs');
const storeRoutes = require('./src/routes/storeRoutes');
const userRoutes = require('./src/routes/userRoutes');
const itemRoutes = require('./src/routes/itemRoutes'); 
const transactionRoutes = require('./src/routes/transactionRoutes');
const cors = require('cors');

const app = express();

// CORS configuration - update to allow all origins for testing
const corsOptions = { 
  origin: '*', // Allow all origins temporarily for debugging
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

// Add a simple root endpoint for health check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SBD Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// Debug route to check environment
app.get('/debug', (req, res) => {
  res.status(200).json({
    message: 'Debug information',
    node_env: process.env.NODE_ENV,
    database_connection: !!process.env.DATABASE_URL || !!process.env.PG_CONNECTION_STRING,
    routes: {
      store: '/store',
      user: '/user',
      item: '/item',
      transaction: '/transaction'
    }
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

app.use('/store', storeRoutes);
app.use('/user', userRoutes);
app.use('/item', itemRoutes); 
app.use('/transaction', transactionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});