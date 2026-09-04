import dotenv from 'dotenv';
dotenv.config();

export const config = {
  BOT_TOKEN: process.env.BOT_TOKEN || '',
  PTERODACTYL_URL: process.env.PTERODACTYL_URL || '',
  PTERODACTYL_API_KEY: process.env.PTERODACTYL_API_KEY || '',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/bot_db',
  STARTING_COINS: parseInt(process.env.STARTING_COINS || '100'),
  COINS_PER_REFERRAL: parseInt(process.env.COINS_PER_REFERRAL || '50'),
  SERVER_COST: parseInt(process.env.SERVER_COST || '200'),
  ADMIN_ID: parseInt(process.env.ADMIN_ID || '8926614435'),
  LOGO_URL: 'https://files.catbox.moe/cqk5ac.jpg',
  BOT_NAME: 'NOX FREEPANEL BOT'
};

// Export par défaut pour les imports
export default config;
