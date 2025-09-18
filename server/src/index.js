import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import leadRoutes from './routes/lead.route.js';
import { connectDB } from './lib/db.js';
const app = express();
dotenv.config();
app.use(express.json({}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);


app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
  connectDB();
});

