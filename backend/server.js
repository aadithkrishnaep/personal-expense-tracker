const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const expenseRoutes = require('./routes/expenseRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/expenses', expenseRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'Personal Expense Tracker API',
    timestamp: new Date().toISOString(),
  });
});

// Root welcome endpoint
app.get('/', (req, res) => {
  res.send('Personal Expense Tracker API is running smoothly.');
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

let PORT = parseInt(process.env.PORT, 10) || 5001;

const startServer = (portToTry) => {
  const server = app.listen(portToTry, () => {
    console.log(`[Server] Expense Tracker Backend running on port ${portToTry}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`[Server] Port ${portToTry} is in use, attempting port ${portToTry + 1}...`);
      startServer(portToTry + 1);
    } else {
      console.error('[Server Error]', err);
    }
  });

  return server;
};

const serverInstance = startServer(PORT);

module.exports = app;
