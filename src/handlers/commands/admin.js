const User = require('../../database/models/User');
const Server = require('../../database/models/Server');
const Transaction = require('../../database/models/Transaction');
const RedeemCode = require('../../database/models/RedeemCode');
const { formatQuote, formatBold } = require('../../utils/formatter');
const { adminKeyboard } = require('../../utils/keyboard');
const config = require('../../config');

function isAdmin(ctx) {
  return ctx.from.id === config.ADMIN_ID;
}

// === ADMIN PANEL ===
async function adminCommand(ctx) {
  if (!isAdmin(ctx)) {
    await ctx.reply(formatQuote('⛔ Admin access only.'));
    return;
  }

  const totalUsers = await User.countDocuments();
  const totalServers = await Server.countDocuments();
  const totalCoins = await User.aggregate([
    { $group: { _id: null, total: { $sum: '$coins' } } }
  ]);
  const totalTransactions = await Transaction.countDocuments();

  let message = `👑 <b>Admin Panel - ${config.BOT_NAME}</b>\n\n`;
  message += `📊 <b>Global Statistics</b>\n`;
  message += `👥 Users: ${totalUsers}\n`;
  message += `🖥️ Servers: ${totalServers}\n`;
  message += `💰 Total Coins: ${totalCoins[0]?.total || 0}\n`;
  message += `💳 Transactions: ${totalTransactions}\n\n`;
  message += `📌 <b>Available Actions:</b>`;

  await ctx.replyWithPhoto(
    { url: config.LOGO_URL },
    {
      caption: formatQuote(message),
      parse_mode: 'HTML',
      ...adminKeyboard
    }
  );
}

// === LIST USERS ===
async function adminUsers(ctx) {
  if (!isAdmin(ctx)) return;

  const users = await User.find().sort({ createdAt: -1 }).limit(20);
  let message = `👥 <b>Recent Users (20)</b>\n\n`;

  users.forEach((user, i) => {
    const servers = user.servers?.length || 0;
    message += `${i + 1}. ${user.firstName}\n`;
    message += `   🆔 ${user.telegramId}\n`;
    message += `   💰 ${user.coins} coins\n`;
    message += `   🖥️ ${servers} servers\n`;
    message += `   👥 ${user.referrals?.length || 0} referrals\n\n`;
  });

  await ctx.reply(formatQuote(message), { parse_mode: 'HTML' });
}

// === LIST SERVERS ===
async function adminServers(ctx) {
  if (!isAdmin(ctx)) return;

  const servers = await Server.find().sort({ createdAt: -1 }).limit(20);
  let message = `🖥️ <b>Recent Servers (20)</b>\n\n`;

  servers.forEach((server, i) => {
    message += `${i + 1}. ${server.name}\n`;
    message += `   🆔 ${server.serverId}\n`;
    message += `   👤 User: ${server.userId}\n`;
    message += `   📦 Type: ${server.type}\n`;
    message += `   💾 RAM: ${server.memory}MB\n`;
    message += `   📊 Status: ${server.status}\n\n`;
  });

  await ctx.reply(formatQuote(message), { parse_mode: 'HTML' });
}

// === ADD COINS ===
async function adminAddCoins(ctx) {
  if (!isAdmin(ctx)) return;

  const args = ctx.message?.text?.split(' ') || [];
  if (args.length < 3) {
    await ctx.reply(formatQuote('⚠️ Usage: /addcoins <userId> <amount>\nExample: /addcoins 123456789 100'));
    return;
  }

  const userId = parseInt(args[1]);
  const amount = parseInt(args[2]);

  try {
    const user = await User.findOne({ telegramId: userId });
    if (!user) {
      await ctx.reply(formatQuote('❌ User not found.'));
      return;
    }

    user.coins += amount;
    await user.save();

    await ctx.reply(
      formatQuote(`✅ ${amount > 0 ? '+' : ''}${amount} coins for ${user.firstName}\n💰 New balance: ${user.coins}`),
      { parse_mode: 'HTML' }
    );
  } catch (error) {
    await ctx.reply(formatQuote(`❌ Error: ${error.message}`));
  }
}

// === GIFT ALL ===
async function adminGiftAll(ctx) {
  if (!isAdmin(ctx)) return;

  const args = ctx.message?.text?.split(' ') || [];
  if (args.length < 2) {
    await ctx.reply(formatQuote('⚠️ Usage: /giftall <amount>\nExample: /giftall 10'));
    return;
  }

  const amount = parseInt(args[1]);
  if (isNaN(amount) || amount <= 0) {
    await ctx.reply(formatQuote('❌ Invalid amount.'));
    return;
  }

  try {
    const result = await User.updateMany(
      {},
      { $inc: { coins: amount } }
    );

    await ctx.reply(
      formatQuote(`🎁 <b>Gift sent to everyone!</b>\n\n+${amount} coins for ${result.modifiedCount} users.`),
      { parse_mode: 'HTML' }
    );
  } catch (error) {
    await ctx.reply(formatQuote(`❌ Error: ${error.message}`));
  }
}

// === CREATE REDEEM CODE ===
async function adminCreateRedeem(ctx) {
  if (!isAdmin(ctx)) return;

  const args = ctx.message?.text?.split(' ') || [];
  if (args.length < 3) {
    await ctx.reply(formatQuote('⚠️ Usage: /createredeem <reward> <maxUses>\nExample: /createredeem 10 5'));
    return;
  }

  const reward = parseInt(args[1]);
  const maxUses = parseInt(args[2]) || 1;

  try {
    const code = generateRedeemCode();
    const redeem = new RedeemCode({
      code,
      reward,
      maxUses,
      createdBy: ctx.from.id
    });
    await redeem.save();

    await ctx.reply(
      formatQuote(`🔑 <b>Code created!</b>\n\nCode: <code>${code}</code>\n🎁 Reward: ${reward} coins\n👥 Max uses: ${maxUses}`),
      { parse_mode: 'HTML' }
    );
  } catch (error) {
    await ctx.reply(formatQuote(`❌ Error: ${error.message}`));
  }
}

function generateRedeemCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'NOX';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// === BROADCAST ===
async function adminBroadcast(ctx) {
  if (!isAdmin(ctx)) return;

  const message = ctx.message?.text?.replace('/broadcast', '').trim();
  if (!message) {
    await ctx.reply(formatQuote('⚠️ Usage: /broadcast <message>\nExample: /broadcast New update available!'));
    return;
  }

  try {
    const users = await User.find({}, 'telegramId');
    let sent = 0;
    let failed = 0;

    for (const user of users) {
      try {
        await ctx.telegram.sendMessage(user.telegramId, formatQuote(`📢 <b>NOX PANEL BOT ANNOUNCE</b>\n\n${message}`), {
          parse_mode: 'HTML'
        });
        sent++;
        await new Promise(resolve => setTimeout(resolve, 50));
      } catch (error) {
        failed++;
      }
    }

    await ctx.reply(
      formatQuote(`📢 <b>Broadcast complete!</b>\n\n✅ Sent: ${sent}\n❌ Failed: ${failed}`),
      { parse_mode: 'HTML' }
    );
  } catch (error) {
    await ctx.reply(formatQuote(`❌ Error: ${error.message}`));
  }
}

// === FREE SERVERS ===
async function adminFreeServers(ctx) {
  if (!isAdmin(ctx)) return;
  await ctx.reply(formatQuote('🆓 <b>Free Servers</b>\n\nFeature under development...'), {
    parse_mode: 'HTML'
  });
}

// === ADMIN STATS ===
async function adminStats(ctx) {
  if (!isAdmin(ctx)) return;

  const totalUsers = await User.countDocuments();
  const totalServers = await Server.countDocuments();
  const totalCoins = await User.aggregate([
    { $group: { _id: null, total: { $sum: '$coins' } } }
  ]);
  const totalTransactions = await Transaction.countDocuments();
  const totalReferrals = await User.aggregate([
    { $project: { count: { $size: '$referrals' } } },
    { $group: { _id: null, total: { $sum: '$count' } } }
  ]);

  let message = `📊 <b>Advanced Statistics</b>\n\n`;
  message += `👥 Users: ${totalUsers}\n`;
  message += `🖥️ Servers: ${totalServers}\n`;
  message += `💰 Total Coins: ${totalCoins[0]?.total || 0}\n`;
  message += `💳 Transactions: ${totalTransactions}\n`;
  message += `👥 Referrals: ${totalReferrals[0]?.total || 0}\n\n`;
  message += `📈 <b>Averages:</b>\n`;
  message += `Coins/user: ${Math.round((totalCoins[0]?.total || 0) / (totalUsers || 1))}\n`;
  message += `Servers/user: ${Math.round(totalServers / (totalUsers || 1))}`;

  await ctx.reply(formatQuote(message), { parse_mode: 'HTML' });
}

module.exports = {
  adminCommand,
  adminUsers,
  adminServers,
  adminAddCoins,
  adminGiftAll,
  adminCreateRedeem,
  adminBroadcast,
  adminFreeServers,
  adminStats
};
