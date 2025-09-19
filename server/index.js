import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './src/routes/auth.route.js';
import leadRoutes from './src/routes/lead.route.js';
import { connectDB } from './src/lib/db.js';
import cors from 'cors';
const app = express();
dotenv.config();
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
}));
app.use(express.json({}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);


app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
  connectDB();
});

