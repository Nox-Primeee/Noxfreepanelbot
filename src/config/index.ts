import dotenv from 'dotenv';
dotenv.config();

export const config = {
  // Telegram
  BOT_TOKEN: process.env.BOT_TOKEN || '',
  BOT_NAME: 'NOX FREEPANEL BOT',
  ADMIN_ID: 8926614435,
  
  // Pterodactyl
  PTERODACTYL_URL: process.env.PTERODACTYL_URL || '',
  PTERODACTYL_API_KEY: process.env.PTERODACTYL_API_KEY || '',
  
  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/bot_db',
  
  // Coins
  STARTING_COINS: 100,
  COINS_PER_REFERRAL: 50,
  COINS_PER_SERVER: 10,
  SERVER_COST: 200,
  
  // Images
  LOGO_URL: 'https://files.catbox.moe/cqk5ac.jpg',
};
