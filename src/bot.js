const { Telegraf, session } = require('telegraf');
const mongoose = require('mongoose');
const express = require('express');
require('dotenv').config();

const config = require('./config');

// Commandes
const { startCommand } = require('./handlers/commands/start');
const { balanceCommand } = require('./handlers/commands/balance');
const { referralCommand } = require('./handlers/commands/referral');
const { createCommand, createServerType } = require('./handlers/commands/create');
const { helpCommand } = require('./handlers/commands/help');
const { adminCommand, adminUsers, adminCoins, addCoinsCommand } = require('./handlers/commands/admin');

// Utilitaires
const { formatQuote } = require('./utils/formatter');
const { mainKeyboard } = require('./utils/keyboard');

// Initialisation du bot
const bot = new Telegraf(config.BOT_TOKEN);

// Middleware
bot.use(session());

// Logger
bot.use(async (ctx, next) => {
  const text = ctx.message?.text || 'callback';
  console.log(`📝 ${ctx.from?.first_name} (${ctx.from?.id}) a utilisé: ${text}`);
  await next();
});

// === COMMANDES ===
bot.start(startCommand);
bot.command('balance', balanceCommand);
bot.command('referral', referralCommand);
bot.command('create', createCommand);
bot.command('help', helpCommand);

bot.command('servers', async (ctx) => {
  await ctx.reply(formatQuote('📊 <b>Vos serveurs</b>\n\nFonctionnalité en cours de développement...'), {
    parse_mode: 'HTML',
    ...mainKeyboard
  });
});

// Commandes admin
bot.command('admin', adminCommand);
bot.command('addcoins', addCoinsCommand);
bot.command('adminusers', adminUsers);
bot.command('admincoins', adminCoins);

// === CALLBACKS ===
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
  const User = require('./database/models/User');
  const user = await User.findOne({ telegramId: ctx.from.id });
  if (user) {
    await ctx.reply(
      formatQuote(`🔗 <b>Partagez votre lien :</b>\n\nhttps://t.me/${ctx.botInfo.username}?start=${user.referralCode}`),
      { parse_mode: 'HTML' }
    );
  }
});

// === MONGODB ===
mongoose.connect(config.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// === SERVEUR EXPRESS (pour Render) ===
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('🤖 NOX FREEPANEL BOT is running!');
});

app.listen(PORT, () => {
  console.log(`✅ Web server running on port ${PORT}`);
});

// === LANCEMENT DU BOT ===
bot.launch()
  .then(() => {
    console.log(`🤖 ${config.BOT_NAME} started successfully!`);
    console.log(`👑 Admin ID: ${config.ADMIN_ID}`);
  })
  .catch(err => console.error('❌ Bot error:', err));

// === GESTION DES ARRÊTS ===
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

module.exports = bot;
