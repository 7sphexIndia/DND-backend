import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import contactRoutes from './routes/contactRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', contactRoutes);
app.use('/api', adminRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'DND Backend is running' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

export default app;
