import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transactions.js';
import budgetRoutes from './routes/budgets.js';
import analyticsRoutes from './routes/analytics.js';
import connectDatabase from './config/database.js';

dotenv.config();

const app = express();

// CORS with dynamic allow-list (supports localhost and Vercel)
const defaultOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'];
const envOrigin = process.env.CLIENT_URL ? [process.env.CLIENT_URL] : [];
const envOrigins = process.env.CLIENT_URLS ? process.env.CLIENT_URLS.split(',').map(s => s.trim()).filter(Boolean) : [];
const explicitOrigins = ['https://expense-tracker-alpha-hazel-19.vercel.app'];
const allowedOrigins = new Set([...defaultOrigins, ...envOrigin, ...envOrigins, ...explicitOrigins]);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser or same-origin
    if (allowedOrigins.has(origin)) return callback(null, true);
    // allow all *.vercel.app
    try {
      const { hostname, protocol } = new URL(origin);
      if ((protocol === 'https:' || protocol === 'http:') && hostname.endsWith('.vercel.app')) {
        return callback(null, true);
      }
    } catch (_) {}
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'Expense Tracker API' });
});

// Simple health endpoint with DB status for monitoring
app.get('/health', (_req, res) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting', 'unauthorized', 'unknown'];
  let dbState = 'unknown';
  try {
    // Lazy require to avoid a hard dep loop
    // eslint-disable-next-line global-require
    const mongoose = require('mongoose');
    dbState = states[mongoose.connection.readyState] || String(mongoose.connection.readyState);
  } catch (_) {}
  res.json({ status: 'ok', db: dbState, uptime: process.uptime() });
});

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/analytics', analyticsRoutes);

const PORT = process.env.PORT || 5000;

connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});

// Catch unhandled rejections/exceptions so the process doesn't crash unexpectedly
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});