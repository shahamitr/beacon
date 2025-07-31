import mongoose from 'mongoose';

const websiteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Website', websiteSchema);
