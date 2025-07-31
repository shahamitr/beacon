import mongoose from 'mongoose';

const scanSchema = new mongoose.Schema({
  website: { type: mongoose.Schema.Types.ObjectId, ref: 'Website', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'running', 'completed', 'failed'], default: 'pending' },
  result: { type: Object }, // axe-core JSON output
  issues: [{
    fingerprint: String,
    ruleId: String,
    impact: String,
    description: String,
    help: String,
    wcag: String,
    wcagLevel: String,
    selector: String,
    html: String,
    context: String,
  }],
  startedAt: { type: Date },
  completedAt: { type: Date },
  error: { type: String }
});

export default mongoose.model('Scan', scanSchema);
