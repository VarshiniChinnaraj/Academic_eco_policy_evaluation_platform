const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/environment', require('./routes/environment'));
app.use('/api/dashboard',   require('./routes/dashboard'));
app.use('/api/reports',     require('./routes/reports'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Green Campus API Running' });
});

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/green-campus');
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
