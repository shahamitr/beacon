import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import './queue.js';
const logger = require('./logger.js');

const app = express();
app.use(cors());
app.use(express.json());

import authRoutes from './routes/auth.js';
import websiteRoutes from './routes/websites.js';
import scanRoutes from './routes/scans.js';
import exportRoutes from './routes/export.js';

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/beacon';

app.use('/api/auth', authRoutes);
app.use('/api/websites', websiteRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/export', exportRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the Beacon API!' });
});

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch(err => logger.error('MongoDB connection error: %s', err.stack || err.message));
