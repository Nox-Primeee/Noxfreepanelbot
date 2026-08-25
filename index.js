const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_TOKEN; // Dans .env
const bot = new TelegramBot(token, { polling: true });

// Commande /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, '👋 Bienvenue sur mon bot Telegram !');
});

// Répondre à tous les messages
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `📩 Tu as dit : ${msg.text}`);
});

console.log('🤖 Bot Telegram en ligne !');
