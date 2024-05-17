import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import employeeRoutes from './routes/employeeRoutes';
import jobRoutes from './routes/jobRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/employee-dashboard';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api', employeeRoutes);
app.use('/api', jobRoutes);
app.use('/api', authRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
