require('dotenv').config();

module.exports = {
  BOT_TOKEN: process.env.BOT_TOKEN || '',
  PTERODACTYL_URL: process.env.PTERODACTYL_URL || '',
  PTERODACTYL_API_KEY: process.env.PTERODACTYL_API_KEY || '',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/bot_db',
  
  // Coins
  STARTING_COINS: 10,
  COINS_PER_REFERRAL: 50,
  DAILY_COINS: 20,
  SERVER_COST: 200,
  
  // Plans
  PLANS: {
    FREE: { name: 'Free', servers: 1, memory: 1024, price: 0 },
    PREMIUM: { name: 'Premium', servers: 5, memory: 2048, price: 500 },
    VIP: { name: 'VIP', servers: 10, memory: 4096, price: 1000 },
    OWNER: { name: 'Owner', servers: 100, memory: 8192, price: 5000 }
  },
  
  // Admin
  ADMIN_ID: parseInt(process.env.ADMIN_ID || '8926614435'),
  
  // Images
  LOGO_URL: 'https://files.catbox.moe/cqk5ac.jpg',
  BOT_NAME: 'NOX FREEPANEL BOT'
};
