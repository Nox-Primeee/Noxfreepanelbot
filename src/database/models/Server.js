const mongoose = require('mongoose');

const ServerSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  serverId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true }, // free, premium, vip, owner
  ram: { type: Number, required: true }, // en MB
  duration: { type: String, required: true }, // 24h, 7d, 30d, unlimited
  price: { type: Number, required: true },
  status: { type: String, default: 'active' },
  username: { type: String }, // généré automatiquement
  password: { type: String }, // généré automatiquement
  domain: { type: String }, // sous-domaine
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Server', ServerSchema);
