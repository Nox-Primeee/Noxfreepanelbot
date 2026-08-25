const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

// === SERVEUR HTTP ===
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
    res.send('🤖 Bot Telegram en ligne !');
});

app.listen(PORT, () => {
    console.log(`✅ Serveur HTTP sur le port ${PORT}`);
});

// === BOT TELEGRAM ===
const token = process.env.TELEGRAM_TOKEN;

if (!token) {
    console.error('❌ Token manquant ! Ajoute TELEGRAM_TOKEN dans .env');
    process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

// Commande /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name || 'Utilisateur';
    bot.sendMessage(chatId, `👋 Bonjour ${firstName} ! Bienvenue sur mon bot Telegram !`);
});

// Commande /help
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '📋 Commandes disponibles :\n/start - Démarrer\n/help - Aide\n/info - Infos sur le bot');
});

// Commande /info
bot.onText(/\/info/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '🤖 Bot créé avec Node.js et node-telegram-bot-api\n🚀 Hébergé sur Render.com');
});

// Répondre à tous les messages (sauf les commandes)
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    // Ignorer les commandes déjà traitées
    if (text === '/start' || text === '/help' || text === '/info') return;

    // Si le message contient "merci" ou "Merci"
    if (text && text.toLowerCase().includes('merci')) {
        bot.sendMessage(chatId, '😊 De rien ! Content de t\'aider !');
        return;
    }

    // Réponse par défaut
    bot.sendMessage(chatId, `📩 Tu as dit : "${text}"`);
});

// Gestion des erreurs
bot.on('polling_error', (error) => {
    console.log('⚠️ Erreur de polling:', error.message);
});

console.log('🤖 Bot Telegram en ligne !');
