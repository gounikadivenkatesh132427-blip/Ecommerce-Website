import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { initDb } from './data/db.js';
import { connectMongoDb, isMongoConnected } from './config/dbConnect.js';

dotenv.config();

// Route imports
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import promoRoutes from './routes/promoRoutes.js';
import conciergeRoutes from './routes/conciergeRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database Engines
initDb();
connectMongoDb();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'AURA Luxury E-Commerce REST API',
    version: '1.0.0',
    database: isMongoConnected ? 'MongoDB (Connected)' : 'Persistent JSON Storage (Fallback Active)',
    mongodbConfigured: Boolean(process.env.MONGODB_URI),
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/promos', promoRoutes);
app.use('/api', conciergeRoutes);
app.use('/api/admin', adminRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.url} not found`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`✨ AURA Backend Server listening on http://localhost:${PORT}`);
  console.log(`💎 API Health endpoint: http://localhost:${PORT}/api/health`);
});

export default app;
