import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'beacon_secret';

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required.' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'User already exists.' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash });
    res.status(201).json({ id: user._id, email: user.email });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials.' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials.' });
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed.' });
  }
});

export default router;
