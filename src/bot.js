const { Telegraf, session } = require('telegraf');
const mongoose = require('mongoose');
const express = require('express');
require('dotenv').config();

const config = require('./config');

// ========== MIDDLEWARE ==========
const { checkChannel } = require('./middleware/checkChannel');

// ========== COMMANDES UTILISATEUR ==========
const { menuCommand } = require('./handlers/commands/menu');
const { coinsCommand } = require('./handlers/commands/coins');
const { dailyCommand } = require('./handlers/commands/daily');
const { referralCommand } = require('./handlers/commands/referral');
const { statsCommand } = require('./handlers/commands/stats');
const { helpCommand } = require('./handlers/commands/help');
const { myidCommand } = require('./handlers/commands/myid');
const { buyserverCommand, buyServerType, handleBuyAction } = require('./handlers/commands/buyserver');
const { myserversCommand } = require('./handlers/commands/myservers');
const { purchaseCommand } = require('./handlers/commands/purchase');
const { upgradeCommand } = require('./handlers/commands/upgrade');
const { profileCommand } = require('./handlers/commands/profile');
const { leaderboardCommand } = require('./handlers/commands/leaderboard');
const { redeemCommand } = require('./handlers/commands/redeem');
const { shopCommand } = require('./handlers/commands/shop');
const { verifyCommand } = require('./handlers/commands/verify');

// ========== COMMANDES ADMIN ==========
const {
  adminCommand,
  adminUsers,
  adminUserInfo,
  adminDeleteUser,
  adminSetPlan,
  adminServers,
  adminDeleteServer,
  adminFreeServers,
  adminCheckExpired,
  adminAddCoins,
  adminGiftAll,
  adminCreateRedeem,
  adminBroadcast,
  adminStats
} = require('./handlers/commands/admin');

// ========== UTILITAIRES ==========
const { formatQuote } = require('./utils/formatter');
const { mainKeyboard } = require('./utils/keyboard');

// ========== INITIALISATION DU BOT ==========
const bot = new Telegraf(config.BOT_TOKEN);

// ========== MIDDLEWARES ==========
bot.use(session());

// Logger
bot.use(async (ctx, next) => {
  const text = ctx.message?.text || 'callback';
  console.log(`📝 ${ctx.from?.first_name} (${ctx.from?.id}) used: ${text}`);
  await next();
});

// Vérification des canaux (sauf pour /start et /verify)
bot.use(async (ctx, next) => {
  const command = ctx.message?.text?.split(' ')[0] || '';
  if (command === '/start' || command === '/verify') {
    return next();
  }
  await checkChannel(ctx, next);
});

// ========== COMMANDES UTILISATEUR ==========
bot.start(menuCommand);
bot.command('menu', menuCommand);
bot.command('coins', coinsCommand);
bot.command('daily', dailyCommand);
bot.command('referral', referralCommand);
bot.command('stats', statsCommand);
bot.command('help', helpCommand);
bot.command('myid', myidCommand);
bot.command('buyserver', buyserverCommand);
bot.command('myservers', myserversCommand);
bot.command('purchase', purchaseCommand);
bot.command('upgrade', upgradeCommand);
bot.command('profile', profileCommand);
bot.command('leaderboard', leaderboardCommand);
bot.command('redeem', redeemCommand);
bot.command('shop', shopCommand);
bot.command('verify', verifyCommand);

// ========== COMMANDES ADMIN ==========
bot.command('admin', adminCommand);
bot.command('listusers', adminUsers);
bot.command('userinfo', adminUserInfo);
bot.command('deluser', adminDeleteUser);
bot.command('setplan', adminSetPlan);
bot.command('listservers', adminServers);
bot.command('delserver', adminDeleteServer);
bot.command('freeservers', adminFreeServers);
bot.command('checkexpired', adminCheckExpired);
bot.command('addcoins', adminAddCoins);
bot.command('giftall', adminGiftAll);
bot.command('createredeem', adminCreateRedeem);
bot.command('broadcast', adminBroadcast);
bot.command('adminstats', adminStats);

// ========== CALLBACKS ==========

// --- Menu principal ---
bot.action('coins', async (ctx) => {
  await ctx.answerCbQuery();
  await coinsCommand(ctx);
});
bot.action('stats', async (ctx) => {
  await ctx.answerCbQuery();
  await statsCommand(ctx);
});
bot.action('daily', async (ctx) => {
  await ctx.answerCbQuery();
  await dailyCommand(ctx);
});
bot.action('referral', async (ctx) => {
  await ctx.answerCbQuery();
  await referralCommand(ctx);
});
bot.action('buyserver', async (ctx) => {
  await ctx.answerCbQuery();
  await buyserverCommand(ctx);
});
bot.action('myservers', async (ctx) => {
  await ctx.answerCbQuery();
  await myserversCommand(ctx);
});
bot.action('shop', async (ctx) => {
  await ctx.answerCbQuery();
  await shopCommand(ctx);
});
bot.action('profile', async (ctx) => {
  await ctx.answerCbQuery();
  await profileCommand(ctx);
});
bot.action('leaderboard', async (ctx) => {
  await ctx.answerCbQuery();
  await leaderboardCommand(ctx);
});
bot.action('help', async (ctx) => {
  await ctx.answerCbQuery();
  await helpCommand(ctx);
});
bot.action('admin', async (ctx) => {
  await ctx.answerCbQuery();
  await adminCommand(ctx);
});

// --- Serveurs ---
bot.action('server_free', async (ctx) => {
  await ctx.answerCbQuery();
  await buyServerType(ctx, 'free');
});
bot.action('server_premium', async (ctx) => {
  await ctx.answerCbQuery();
  await buyServerType(ctx, 'premium');
});
bot.action('server_vip', async (ctx) => {
  await ctx.answerCbQuery();
  await buyServerType(ctx, 'vip');
});
bot.action('server_owner', async (ctx) => {
  await ctx.answerCbQuery();
  await buyServerType(ctx, 'owner');
});

// --- Achat de serveur personnalisé (RAM/durée) ---
bot.action(/buy_(\d+)_(\w+)_(\d+)/, async (ctx) => {
  const [_, ram, duration, price] = ctx.match;
  await ctx.answerCbQuery();
  await handleBuyAction(ctx, parseInt(ram), duration, parseInt(price));
});

// --- Admin ---
bot.action('admin_users', async (ctx) => {
  await ctx.answerCbQuery();
  await adminUsers(ctx);
});
bot.action('admin_servers', async (ctx) => {
  await ctx.answerCbQuery();
  await adminServers(ctx);
});
bot.action('admin_addcoins', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(formatQuote('💰 Use /addcoins <userId> <amount>'));
});
bot.action('admin_giftall', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(formatQuote('🎁 Use /giftall <amount>'));
});
bot.action('admin_createredeem', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(formatQuote('🔑 Use /createredeem <reward> <maxUses>'));
});
bot.action('admin_broadcast', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(formatQuote('📢 Use /broadcast <message>'));
});
bot.action('admin_freeservers', async (ctx) => {
  await ctx.answerCbQuery();
  await adminFreeServers(ctx);
});
bot.action('admin_stats', async (ctx) => {
  await ctx.answerCbQuery();
  await adminStats(ctx);
});

// --- Referral ---
bot.action('share_referral', async (ctx) => {
  await ctx.answerCbQuery();
  const User = require('./database/models/User');
  const user = await User.findOne({ telegramId: ctx.from.id });
  if (user) {
    await ctx.reply(
      formatQuote(`🔗 <b>Share your link:</b>\n\nhttps://t.me/${ctx.botInfo.username}?start=${user.referralCode}`),
      { parse_mode: 'HTML' }
    );
  }
});
bot.action('my_referrals', async (ctx) => {
  await ctx.answerCbQuery();
  await referralCommand(ctx);
});

// --- Shop ---
bot.action('buy_100', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(formatQuote('🪙 <b>100 coins - 1$</b>\n\nContact @Nox-primeee to pay.'));
});
bot.action('buy_500', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(formatQuote('🪙 <b>500 coins - 4$</b>\n\nContact @Nox-primeee to pay.'));
});
bot.action('buy_1000', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(formatQuote('🪙 <b>1000 coins - 7$</b>\n\nContact @Nox-primeee to pay.'));
});
bot.action('buy_5000', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(formatQuote('🪙 <b>5000 coins - 30$</b>\n\nContact @Nox-primeee to pay.'));
});
bot.action('buy_premium', async (ctx) => {
  await ctx.answerCbQuery();
  await buyServerType(ctx, 'premium');
});
bot.action('buy_vip', async (ctx) => {
  await ctx.answerCbQuery();
  await buyServerType(ctx, 'vip');
});

// --- Copier identifiants ---
bot.action(/copy_(.+)/, async (ctx) => {
  const text = ctx.match[1];
  await ctx.answerCbQuery(`✅ Copied: ${text}`);
  // On envoie le texte dans un message pour que l'utilisateur puisse le copier
  await ctx.reply(`📋 <code>${text}</code>`, { parse_mode: 'HTML' });
});

// --- Retour ---
bot.action('back_main', async (ctx) => {
  await ctx.answerCbQuery();
  await menuCommand(ctx);
});

// ========== CONNEXION MONGODB ==========
mongoose.connect(config.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ========== SERVEUR EXPRESS (pour Render) ==========
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('🤖 NOX FREEPANEL BOT is running!');
});

app.listen(PORT, () => {
  console.log(`✅ Web server running on port ${PORT}`);
});

// ========== LANCEMENT DU BOT ==========
bot.launch()
  .then(() => {
    console.log(`🤖 ${config.BOT_NAME} started successfully!`);
    console.log(`👑 Admin ID: ${config.ADMIN_ID}`);
  })
  .catch(err => console.error('❌ Bot error:', err));

// ========== GESTION DES ARRÊTS ==========
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
