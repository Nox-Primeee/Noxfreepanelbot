const mongoose = require('mongoose');

const ServerSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  serverId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, default: 'active' },
  plan: { type: String, default: 'free' },
  memory: { type: Number, default: 1024 },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }
});

module.exports = mongoose.model('Server', ServerSchema);
