import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productsRouter from './routes/products';
import dealersRouter from './routes/dealers';
import ordersRouter from './routes/orders';
import authRouter from './routes/auth';
import statsRouter from './routes/stats';
import warrantiesRouter from './routes/warranties';
import uploadRouter from './routes/upload';
import settingsRouter from './routes/settings';
import blogRouter from './routes/blog';
import agenciesRouter from './routes/agencies';
import offersRouter from './routes/offers';
import cartRouter from './routes/cart';
import path from 'path';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] }));
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', service: 'NUTD API', timestamp: new Date().toISOString() });
});

// Static Files (for image uploads)
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/stats', statsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/products', productsRouter);
app.use('/api/dealers', dealersRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/warranties', warrantiesRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/blog', blogRouter);
app.use('/api/agencies', agenciesRouter);
app.use('/api/offers', offersRouter);
app.use('/api/cart', cartRouter);

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 NUTD API running at http://localhost:${PORT}`);
});

export default app;
