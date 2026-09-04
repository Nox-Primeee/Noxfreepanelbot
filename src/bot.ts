import { Telegraf, session } from 'telegraf';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { config } from './config';
import { startCommand } from './handlers/commands/start';
import { balanceCommand } from './handlers/commands/balance';
import { referralCommand } from './handlers/commands/referral';
// ... autres imports

dotenv.config();

const bot = new Telegraf(config.BOT_TOKEN);

// Middleware de session
bot.use(session());

// Commandes
bot.start(startCommand);
bot.command('balance', balanceCommand);
bot.command('referral', referralCommand);
bot.command('help', helpCommand);

// Connexion à MongoDB
mongoose.connect(config.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Lancement du bot
bot.launch()
  .then(() => console.log('🤖 Bot started'))
  .catch(err => console.error('❌ Bot error:', err));

// Gestion des arrêts
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
