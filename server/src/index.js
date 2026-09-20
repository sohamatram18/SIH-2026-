import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import pino from 'pino';

import { connectDB, disconnectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import schemeRoutes from './routes/schemeRoutes.js';
import institutionRoutes from './routes/institutionRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import walletRoutes from './routes/walletRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import grievanceRoutes from './routes/grievanceRoutes.js';
import jagoRoutes from './routes/jagoRoutes.js';
import officerRoutes from './routes/officerRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true },
  },
});

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Security Middlewares
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows Vite client connection during dev
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiting (General API protection)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
});

app.use('/api', apiLimiter);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'MoTA Unified Scholarship API',
    version: '1.0.0',
    ministry: 'Ministry of Tribal Affairs, Government of India',
    timestamp: new Date(),
    useMocks: process.env.USE_MOCKS === 'true',
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/schemes', schemeRoutes);
app.use('/api/v1/institutions', institutionRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/wallet', walletRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/grievances', grievanceRoutes);
app.use('/api/v1/jago', jagoRoutes);
app.use('/api/v1/officer', officerRoutes);

// Fallback 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use(errorHandler);

// Start Server
const server = app.listen(PORT, async () => {
  await connectDB();
  logger.info(`🚀 MoTA Unified Scholarship API Server running on port ${PORT}`);
  logger.info(`🔗 Health Check: http://localhost:${PORT}/api/v1/health`);
  logger.info(`📋 Schemes API: http://localhost:${PORT}/api/v1/schemes`);
});

// Graceful Shutdown
const handleShutdown = async (signal) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    await disconnectDB();
    logger.info('HTTP server closed. Process terminating.');
    process.exit(0);
  });
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

export default app;
