import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import leadRoutes from './routes/lead.route.js';
import { connectDB } from './lib/db.js';
import cors from 'cors';
const app = express();
dotenv.config();
app.use(cors({
  origin: ['http://localhost:5173', 
    'https://lead-management-pied.vercel.app',
    'https://leadmanagement-i3e5.onrender.com'],
  credentials: true,
}));
app.use(express.json({}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
const PORT = process.env.PORT || 5000;

app.listen(5000, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});

