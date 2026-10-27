/**
 * Express Server Entry Point
 * Personal Expense Tracker - MERN Stack
 * Candidate: Aadith Krishna
 * Exit Examination: Full Stack Development (MERN)
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const { connectDB } = require('./config/db');
const expenseRoutes = require('./routes/expenseRoutes');
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorHandler');

// Initialize environment configuration
dotenv.config();

// Establish database connection
connectDB();

const app = express();

// Standard middleware pipeline
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Custom audit header
app.use((req, res, next) => {
  res.setHeader('X-Application-Author', 'Aadith Krishna');
  res.setHeader('X-Service-Name', 'Personal Expense Tracker API');
  next();
});

// Primary RESTful API routing
app.use('/api/expenses', expenseRoutes);

// System health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'operational',
    service: 'Personal Expense Tracker Service',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// Static distribution serving for SPA
const clientDistPath = path.resolve(__dirname, '../frontend/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
}

// Single Page Application fallback for client-side routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexHtmlPath = path.resolve(clientDistPath, 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    return res.sendFile(indexHtmlPath);
  }
  res.status(200).send('Personal Expense Tracker API is active. React client build pending.');
});

// Centralized error and 404 middlewares
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Dynamic port allocation with collision resolution
let PORT = parseInt(process.env.PORT, 10) || 5001;

const bootServer = (portNumber) => {
  const instance = app.listen(portNumber, () => {
    console.log(`[ExpenseTracker] Backend operational on port: ${portNumber}`);
  });

  instance.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`[Port Conflict] Port ${portNumber} is occupied. Shifting to ${portNumber + 1}...`);
      bootServer(portNumber + 1);
    } else {
      console.error('[Fatal Server Error]', err);
    }
  });

  return instance;
};

const serverInstance = bootServer(PORT);

module.exports = app;
