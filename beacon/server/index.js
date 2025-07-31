import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

import authRoutes from './routes/auth.js';
import websiteRoutes from './routes/websites.js';
import scanRoutes from './routes/scans.js';

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/beacon';


app.use('/api/auth', authRoutes);
app.use('/api/websites', websiteRoutes);
app.use('/api/scans', scanRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the Beacon API!' });
});

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));
