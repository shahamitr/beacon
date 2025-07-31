import express from 'express';
import Website from '../models/Website.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Create website
router.post('/', auth, async (req, res) => {
  try {
    const { name, url } = req.body;
    const website = await Website.create({ user: req.user.id, name, url });
    res.status(201).json(website);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add website.' });
  }
});

// List websites
router.get('/', auth, async (req, res) => {
  try {
    const websites = await Website.find({ user: req.user.id });
    res.json(websites);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch websites.' });
  }
});

// Delete website
router.delete('/:id', auth, async (req, res) => {
  try {
    await Website.deleteOne({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Website deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete website.' });
  }
});

export default router;
