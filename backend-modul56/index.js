require('dotenv').config();
const express = require('express');
const fs = require('fs');
const storeRoutes = require('./src/routes/storeRoutes');
const userRoutes = require('./src/routes/userRoutes');
const itemRoutes = require('./src/routes/itemRoutes'); 
const transactionRoutes = require('./src/routes/transactionRoutes');
const cors = require('cors');

const app = express();

// CORS configuration
const corsOptions = { 
  origin: ['http://localhost:5173', 'https://os.netlabdte.com', 'https://sbd-project.vercel.app', 'https://*.vercel.app'],
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