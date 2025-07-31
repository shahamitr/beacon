import mongoose from 'mongoose';

const scanSchema = new mongoose.Schema({
  website: { type: mongoose.Schema.Types.ObjectId, ref: 'Website', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'running', 'completed', 'failed'], default: 'pending' },
  result: { type: Object }, // axe-core JSON output
  startedAt: { type: Date },
  completedAt: { type: Date },
  error: { type: String }
});

export default mongoose.model('Scan', scanSchema);
