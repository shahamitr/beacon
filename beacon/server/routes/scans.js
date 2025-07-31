import express from 'express';
import Scan from '../models/Scan.js';
import Website from '../models/Website.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Initiate a scan (manual)
router.post('/:websiteId', auth, async (req, res) => {
  try {
    const website = await Website.findOne({ _id: req.params.websiteId, user: req.user.id });
    if (!website) return res.status(404).json({ message: 'Website not found.' });
    const scan = await Scan.create({ website: website._id, user: req.user.id, status: 'pending' });
    // In production, enqueue scan job here
    res.status(201).json(scan);
  } catch (err) {
    res.status(500).json({ message: 'Failed to initiate scan.' });
  }
});

// List scans for a website
router.get('/:websiteId', auth, async (req, res) => {
  try {
    const scans = await Scan.find({ website: req.params.websiteId, user: req.user.id }).sort({ startedAt: -1 });
    res.json(scans);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch scans.' });
  }
});

// Get scan details
router.get('/detail/:scanId', auth, async (req, res) => {
  try {
    const scan = await Scan.findOne({ _id: req.params.scanId, user: req.user.id });
    if (!scan) return res.status(404).json({ message: 'Scan not found.' });
    res.json(scan);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch scan.' });
  }
});

export default router;
