const express = require('express');
const cors = require('cors');

// Routes
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes');
const testRoutes = require('./routes/testRoutes');

// Middleware
const errorHandler = require('./middlewares/errorHandler');

const app = express();

/**
 * CORS Configuration
 * Uses environment variable
 */
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);

// Error Handler (must be last)
app.use(errorHandler);

module.exports = app;
