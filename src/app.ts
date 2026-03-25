import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import contactRoutes from './routes/contactRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes - Restored /api prefix for production compatibility
app.use('/api', contactRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

export default app;
