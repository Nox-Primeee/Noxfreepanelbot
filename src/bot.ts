import { Telegraf, session } from 'telegraf';
import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
import { config } from './config';

// Commandes
import { startCommand } from './handlers/commands/start';
import { balanceCommand } from './handlers/commands/balance';
import { referralCommand } from './handlers/commands/referral';
import { createCommand, createServerType } from './handlers/commands/create';
import { helpCommand } from './handlers/commands/help';
import { adminCommand, adminUsers, adminCoins, addCoinsCommand } from './handlers/commands/admin';

// Utilitaires
import { formatQuote } from './utils/formatter';
import { mainKeyboard } from './utils/keyboard';

dotenv.config();

const bot = new Telegraf(config.BOT_TOKEN);

// Middleware de session
bot.use(session());

// Middleware pour logger
bot.use(async (ctx, next) => {
  // ✅ CORRIGÉ - Vérification des propriétés
  const message = ctx.message ? (ctx.message as any).text : 'callback';
  const userId = ctx.from?.id || 'unknown';
  console.log(`📝 ${userId} a utilisé: ${message}`);
  await next();
});

// Commandes
bot.start(startCommand);
bot.command('balance', balanceCommand);
bot.command('referral', referralCommand);
bot.command('create', createCommand);
bot.command('help', helpCommand);
bot.command('servers', async (ctx) => {
  await ctx.reply(formatQuote('📊 <b>Vos serveurs</b>\n\nFonctionnalité en cours de développement...'), 
    { parse_mode: 'HTML', ...mainKeyboard }
  );
});

// Commandes admin
bot.command('admin', adminCommand);
bot.command('addcoins', addCoinsCommand);
bot.command('adminusers', adminUsers);
bot.command('admincoins', adminCoins);

// Callbacks
bot.action('balance', async (ctx) => {
  await ctx.answerCbQuery();
  await balanceCommand(ctx);
});

bot.action('referral', async (ctx) => {
  await ctx.answerCbQuery();
  await referralCommand(ctx);
});

bot.action('create', async (ctx) => {
  await ctx.answerCbQuery();
  await createCommand(ctx);
});

bot.action('help', async (ctx) => {
  await ctx.answerCbQuery();
  await helpCommand(ctx);
});

bot.action('admin', async (ctx) => {
  await ctx.answerCbQuery();
  await adminCommand(ctx);
});

bot.action('back_main', async (ctx) => {
  await ctx.answerCbQuery();
  await startCommand(ctx);
});

bot.action('create_minecraft', async (ctx) => {
  await ctx.answerCbQuery();
  await createServerType(ctx, 'minecraft');
});

bot.action('create_web', async (ctx) => {
  await ctx.answerCbQuery();
  await createServerType(ctx, 'web');
});

bot.action('create_game', async (ctx) => {
  await ctx.answerCbQuery();
  await createServerType(ctx, 'game');
});

bot.action('create_other', async (ctx) => {
  await ctx.answerCbQuery();
  await createServerType(ctx, 'other');
});

bot.action('admin_users', async (ctx) => {
  await ctx.answerCbQuery();
  await adminUsers(ctx);
});

bot.action('admin_coins', async (ctx) => {
  await ctx.answerCbQuery();
  await adminCoins(ctx);
});

bot.action('share_referral', async (ctx) => {
  await ctx.answerCbQuery();
  // ✅ CORRIGÉ - User est importé
  const User = require('./database/models/User').default;
  const user = await User.findOne({ telegramId: ctx.from!.id });
  if (user) {
    await ctx.reply(
      formatQuote(`🔗 <b>Partagez votre lien :</b>\n\nhttps://t.me/${ctx.botInfo.username}?start=${user.referralCode}`),
      { parse_mode: 'HTML' }
    );
  }
});

// Connexion MongoDB
mongoose.connect(config.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Serveur Express pour Render
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('🤖 NOX FREEPANEL BOT is running!');
});

app.listen(PORT, () => {
  console.log(`✅ Web server running on port ${PORT}`);
});

// Lancement du bot
bot.launch()
  .then(() => {
    console.log(`🤖 ${config.BOT_NAME} started successfully!`);
    console.log(`👑 Admin ID: ${config.ADMIN_ID}`);
  })
  .catch(err => console.error('❌ Bot error:', err));

// Gestion des arrêts
process.once('SIGINT', () => {
  bot.stop('SIGINT');
  mongoose.disconnect();
  console.log('🛑 Bot stopped');
});
process.once('SIGTERM', () => {
  bot.stop('SIGTERM');
  mongoose.disconnect();
  console.log('🛑 Bot stopped');
});

export default bot;
