/**
 * Centralized API Error Handling Middleware
 * Author: Aadith Krishna
 * Exit Examination: Full Stack Development (MERN)
 */

const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `API Route [${req.method} ${req.originalUrl}] does not exist on this server.`,
  });
};

const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server anomaly encountered.';

  console.error(`[Error Handler] ${req.method} ${req.url} -> ${message}`);

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  notFoundHandler,
  globalErrorHandler,
};
