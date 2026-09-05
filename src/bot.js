const { Telegraf, session } = require('telegraf');
const mongoose = require('mongoose');
const express = require('express');
require('dotenv').config();

const config = require('./config');
const { checkChannel } = require('./middleware/checkChannel');

// Appliquer à toutes les commandes sauf /start et /verify
bot.use(async (ctx, next) => {
  if (ctx.message?.text?.startsWith('/start') || ctx.message?.text?.startsWith('/verify')) {
    return next();
  }
  await checkChannel(ctx, next);
});
// Commands
const { menuCommand } = require('./handlers/commands/menu');
const { coinsCommand } = require('./handlers/commands/coins');
const { dailyCommand } = require('./handlers/commands/daily');
const { referralCommand } = require('./handlers/commands/referral');
const { statsCommand } = require('./handlers/commands/stats');
const { helpCommand } = require('./handlers/commands/help');
const { myidCommand } = require('./handlers/commands/myid');
const { buyserverCommand, buyServerType } = require('./handlers/commands/buyserver');
const { myserversCommand } = require('./handlers/commands/myservers');
const { purchaseCommand } = require('./handlers/commands/purchase');
const { upgradeCommand } = require('./handlers/commands/upgrade');
const { profileCommand } = require('./handlers/commands/profile');
const { leaderboardCommand } = require('./handlers/commands/leaderboard');
const { redeemCommand } = require('./handlers/commands/redeem');
const { shopCommand } = require('./handlers/commands/shop');

const {
  adminCommand,
  adminUsers,
  adminServers,
  adminAddCoins,
  adminGiftAll,
  adminCreateRedeem,
  adminBroadcast,
  adminFreeServers,
  adminStats
} = require('./handlers/commands/admin');

const { formatQuote } = require('./utils/formatter');
const { mainKeyboard } = require('./utils/keyboard');

const bot = new Telegraf(config.BOT_TOKEN);

bot.use(session());

bot.use(async (ctx, next) => {
  const text = ctx.message?.text || 'callback';
  console.log(`📝 ${ctx.from?.first_name} (${ctx.from?.id}) used: ${text}`);
  await next();
});

// === USER COMMANDS ===
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

// === ADMIN COMMANDS ===
bot.command('admin', adminCommand);
bot.command('listusers', adminUsers);
bot.command('listservers', adminServers);
bot.command('addcoins', adminAddCoins);
bot.command('giftall', adminGiftAll);
bot.command('createredeem', adminCreateRedeem);
bot.command('broadcast', adminBroadcast);
bot.command('freeservers', adminFreeServers);
bot.command('adminstats', adminStats);

// === CALLBACKS ===
bot.action('coins', async (ctx) => { await ctx.answerCbQuery(); await coinsCommand(ctx); });
bot.action('stats', async (ctx) => { await ctx.answerCbQuery(); await statsCommand(ctx); });
bot.action('daily', async (ctx) => { await ctx.answerCbQuery(); await dailyCommand(ctx); });
bot.action('referral', async (ctx) => { await ctx.answerCbQuery(); await referralCommand(ctx); });
bot.action('buyserver', async (ctx) => { await ctx.answerCbQuery(); await buyserverCommand(ctx); });
bot.action('myservers', async (ctx) => { await ctx.answerCbQuery(); await myserversCommand(ctx); });
bot.action('shop', async (ctx) => { await ctx.answerCbQuery(); await shopCommand(ctx); });
bot.action('profile', async (ctx) => { await ctx.answerCbQuery(); await profileCommand(ctx); });
bot.action('leaderboard', async (ctx) => { await ctx.answerCbQuery(); await leaderboardCommand(ctx); });
bot.action('help', async (ctx) => { await ctx.answerCbQuery(); await helpCommand(ctx); });

// Server actions
bot.action('server_free', async (ctx) => { await ctx.answerCbQuery(); await buyServerType(ctx, 'free'); });
bot.action('server_premium', async (ctx) => { await ctx.answerCbQuery(); await buyServerType(ctx, 'premium'); });
bot.action('server_vip', async (ctx) => { await ctx.answerCbQuery(); await buyServerType(ctx, 'vip'); });
bot.action('server_owner', async (ctx) => { await ctx.answerCbQuery(); await buyServerType(ctx, 'owner'); });

// Admin actions
bot.action('admin', async (ctx) => { await ctx.answerCbQuery(); await adminCommand(ctx); });
bot.action('admin_users', async (ctx) => { await ctx.answerCbQuery(); await adminUsers(ctx); });
bot.action('admin_servers', async (ctx) => { await ctx.answerCbQuery(); await adminServers(ctx); });
bot.action('admin_addcoins', async (ctx) => { await ctx.answerCbQuery(); await ctx.reply(formatQuote('💰 Use /addcoins <userId> <amount>')); });
bot.action('admin_giftall', async (ctx) => { await ctx.answerCbQuery(); await ctx.reply(formatQuote('🎁 Use /giftall <amount>')); });
bot.action('admin_createredeem', async (ctx) => { await ctx.answerCbQuery(); await ctx.reply(formatQuote('🔑 Use /createredeem <reward> <maxUses>')); });
bot.action('admin_broadcast', async (ctx) => { await ctx.answerCbQuery(); await ctx.reply(formatQuote('📢 Use /broadcast <message>')); });
bot.action('admin_freeservers', async (ctx) => { await ctx.answerCbQuery(); await adminFreeServers(ctx); });
bot.action('admin_stats', async (ctx) => { await ctx.answerCbQuery(); await adminStats(ctx); });

// Referral actions
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
bot.action('my_referrals', async (ctx) => { await ctx.answerCbQuery(); await referralCommand(ctx); });

// Shop actions
bot.action('buy_100', async (ctx) => { await ctx.answerCbQuery(); await ctx.reply(formatQuote('🪙 <b>100 coins - 1$</b>\n\nContact @Nox-primeee to pay.')); });
bot.action('buy_500', async (ctx) => { await ctx.answerCbQuery(); await ctx.reply(formatQuote('🪙 <b>500 coins - 4$</b>\n\nContact @Nox-primeee to pay.')); });
bot.action('buy_1000', async (ctx) => { await ctx.answerCbQuery(); await ctx.reply(formatQuote('🪙 <b>1000 coins - 7$</b>\n\nContact @Nox-primeee to pay.')); });
bot.action('buy_5000', async (ctx) => { await ctx.answerCbQuery(); await ctx.reply(formatQuote('🪙 <b>5000 coins - 30$</b>\n\nContact @Nox-primeee to pay.')); });
bot.action('buy_premium', async (ctx) => { await ctx.answerCbQuery(); await buyServerType(ctx, 'premium'); });
bot.action('buy_vip', async (ctx) => { await ctx.answerCbQuery(); await buyServerType(ctx, 'vip'); });

bot.action('back_main', async (ctx) => { await ctx.answerCbQuery(); await menuCommand(ctx); });

// === MONGODB ===
mongoose.connect(config.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// === EXPRESS SERVER ===
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('🤖 NOX FREEPANEL BOT is running!');
});

app.listen(PORT, () => {
  console.log(`✅ Web server running on port ${PORT}`);
});

// === START BOT ===
bot.launch()
  .then(() => {
    console.log(`🤖 ${config.BOT_NAME} started successfully!`);
    console.log(`👑 Admin ID: ${config.ADMIN_ID}`);
  })
  .catch(err => console.error('❌ Bot error:', err));

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
