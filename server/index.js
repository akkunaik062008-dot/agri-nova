import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { isGeminiConfigured } from './config/gemini.js';
import { isSupabaseConfigured } from './config/supabaseAdmin.js';

import advisoryRoutes from './routes/advisoryRoutes.js';
import diagnosticRoutes from './routes/diagnosticRoutes.js';
import plotRoutes from './routes/plotRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import marketRoutes from './routes/marketRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// Security and utility middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

app.use(cors({
  origin: (origin, callback) => {
    // Allow local dev origins, tools, or mobile requests with no origin
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1') || origin === CLIENT_ORIGIN) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive in dev to avoid friction
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-demo-user', 'x-user-id']
}));

// Request payload limit set to 10MB to accommodate high-res leaf images
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// API Health Check & System Status
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    service: 'AgriVision AI Core API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    gemini_ai: isGeminiConfigured() ? 'CONNECTED' : 'SIMULATION_FALLBACK_ACTIVE',
    supabase_db: isSupabaseConfigured() ? 'CONNECTED' : 'LOCAL_STORAGE_ACTIVE'
  });
});

// Mount Routes
app.use('/api/v1/advisory', advisoryRoutes);
app.use('/api/v1/diagnostics', diagnosticRoutes);
app.use('/api/v1/plots', plotRoutes);
app.use('/api/v1/history', historyRoutes);
app.use('/api/v1/market', marketRoutes);

// Catch-all 404 Route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint not found: ${req.method} ${req.originalUrl}`
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]:', err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🌾 AgriVision AI Engine is running on port ${PORT}`);
  console.log(`📡 Healthcheck: http://localhost:${PORT}/api/v1/health`);
  console.log(`🤖 Gemini Status: ${isGeminiConfigured() ? 'LIVE (Gemini 2.5 Flash)' : 'SIMULATION ACTIVE'}`);
  console.log(`🗄️ Supabase Status: ${isSupabaseConfigured() ? 'LIVE (PostgreSQL RLS)' : 'DEV STORAGE ACTIVE'}`);
  console.log(`====================================================`);
});

export default app;
