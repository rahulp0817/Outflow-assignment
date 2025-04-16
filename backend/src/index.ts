import express from "express";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import campaign from './routes/campaign';
import message from './routes/message';
import lead from './routes/leads';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/campaigns', campaign);
app.use('/personalized-message', message);
app.use('/leads', lead);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI || '', {}).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error(err));
