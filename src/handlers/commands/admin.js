// src/handlers/commands/admin.js
const User = require('../../database/models/User');
const Server = require('../../database/models/Server');
const Transaction = require('../../database/models/Transaction');
const RedeemCode = require('../../database/models/RedeemCode');
const CoinService = require('../../services/coin/CoinService');
const ServerService = require('../../services/server/ServerService');
const { formatQuote, formatBold } = require('../../utils/formatter');
const { adminKeyboard } = require('../../utils/keyboard');
const config = require('../../config');

const coinService = new CoinService();
const serverService = new ServerService();

// ========== UTILITAIRES ==========
function isAdmin(ctx) {
  return ctx.from.id === config.ADMIN_ID;
}

function formatDate(date) {
  return new Date(date).toLocaleString();
}

// ========== PANEL PRINCIPAL ==========
async function adminCommand(ctx) {
  if (!isAdmin(ctx)) {
    await ctx.reply(formatQuote('⛔ Admin access only.'));
    return;
  }

  const totalUsers = await User.countDocuments();
  const totalServers = await Server.countDocuments();
  const activeServers = await Server.countDocuments({ status: 'active' });
  const totalCoins = await User.aggregate([
    { $group: { _id: null, total: { $sum: '$coins' } } }
  ]);
  const totalTransactions = await Transaction.countDocuments();
  const totalReferrals = await User.aggregate([
    { $project: { count: { $size: '$referrals' } } },
    { $group: { _id: null, total: { $sum: '$count' } } }
  ]);

  let message = `👑 <b>Admin Panel - ${config.BOT_NAME}</b>\n\n`;
  message += `📊 <b>Global Statistics</b>\n`;
  message += `👥 Users: ${totalUsers}\n`;
  message += `🖥️ Servers: ${totalServers} (${activeServers} active)\n`;
  message += `💰 Total Coins: ${totalCoins[0]?.total || 0}\n`;
  message += `💳 Transactions: ${totalTransactions}\n`;
  message += `👥 Referrals: ${totalReferrals[0]?.total || 0}\n\n`;
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

// ========== LISTE UTILISATEURS ==========
async function adminUsers(ctx) {
  if (!isAdmin(ctx)) return;

  const users = await User.find().sort({ createdAt: -1 }).limit(20);
  let message = `👥 <b>Recent Users (20)</b>\n\n`;

  users.forEach((user, i) => {
    const servers = user.servers?.length || 0;
    message += `${i + 1}. ${user.firstName} @${user.username || 'N/A'}\n`;
    message += `   🆔 ${user.telegramId}\n`;
    message += `   💰 ${user.coins} coins\n`;
    message += `   📦 ${user.plan || 'FREE'}\n`;
    message += `   🖥️ ${servers} servers\n`;
    message += `   👥 ${user.referrals?.length || 0} referrals\n`;
    message += `   📅 ${formatDate(user.createdAt)}\n\n`;
  });

  await ctx.reply(formatQuote(message), { parse_mode: 'HTML' });
}

// ========== DETAILS UTILISATEUR ==========
async function adminUserInfo(ctx) {
  if (!isAdmin(ctx)) return;

  const args = ctx.message?.text?.split(' ') || [];
  if (args.length < 2) {
    await ctx.reply(formatQuote('⚠️ Usage: /userinfo <userId>\nExample: /userinfo 123456789'));
    return;
  }

  const userId = parseInt(args[1]);
  const user = await User.findOne({ telegramId: userId });

  if (!user) {
    await ctx.reply(formatQuote('❌ User not found.'));
    return;
  }

  const servers = await Server.find({ userId });
  const transactions = await Transaction.countDocuments({ userId });

  let message = `👤 <b>User Details</b>\n\n`;
  message += `📛 Name: ${user.firstName} ${user.lastName || ''}\n`;
  message += `👤 Username: @${user.username || 'N/A'}\n`;
  message += `🆔 ID: ${user.telegramId}\n`;
  message += `💰 Coins: ${user.coins}\n`;
  message += `📦 Plan: ${user.plan || 'FREE'}\n`;
  message += `🖥️ Servers: ${servers.length}\n`;
  message += `👥 Referrals: ${user.referrals?.length || 0}\n`;
  message += `💳 Transactions: ${transactions}\n`;
  message += `🔗 Code: <code>${user.referralCode}</code>\n`;
  message += `📅 Joined: ${formatDate(user.createdAt)}\n`;

  if (servers.length > 0) {
    message += `\n🖥️ <b>Servers:</b>\n`;
    servers.forEach((s, i) => {
      message += `   ${i+1}. ${s.name} (${s.serverId}) - ${s.ram}MB - ${s.status}\n`;
    });
  }

  await ctx.reply(formatQuote(message), { parse_mode: 'HTML' });
}

// ========== LISTE SERVEURS ==========
async function adminServers(ctx) {
  if (!isAdmin(ctx)) return;

  const servers = await Server.find().sort({ createdAt: -1 }).limit(20);
  let message = `🖥️ <b>Recent Servers (20)</b>\n\n`;

  servers.forEach((server, i) => {
    const user = server.userId;
    message += `${i + 1}. ${server.name}\n`;
    message += `   🆔 ${server.serverId}\n`;
    message += `   👤 User: ${user}\n`;
    message += `   📦 Type: ${server.type} | ${server.plan}\n`;
    message += `   💾 RAM: ${server.ram}MB\n`;
    message += `   ⏰ Duration: ${server.duration}\n`;
    message += `   🌐 ${server.domain}\n`;
    message += `   📊 Status: ${server.status}\n`;
    message += `   📅 Exp: ${formatDate(server.expiresAt)}\n\n`;
  });

  await ctx.reply(formatQuote(message), { parse_mode: 'HTML' });
}

// ========== AJOUTER COINS ==========
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

    await Transaction.create({
      userId,
      type: 'earn',
      amount,
      description: `Admin added ${amount} coins`
    });

    await ctx.reply(
      formatQuote(`✅ ${amount > 0 ? '+' : ''}${amount} coins for ${user.firstName}\n💰 New balance: ${user.coins}`),
      { parse_mode: 'HTML' }
    );
  } catch (error) {
    await ctx.reply(formatQuote(`❌ Error: ${error.message}`));
  }
}

// ========== GIFT ALL ==========
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

// ========== CREER REDEEM CODE ==========
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

// ========== BROADCAST ==========
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
        await ctx.telegram.sendMessage(user.telegramId, formatQuote(`📢 <b>NOX Announcement</b>\n\n${message}`), {
          parse_mode: 'HTML'
        });
        sent++;
        await new Promise(resolve => setTimeout(resolve, 50)); // Rate limit
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

// ========== FREE SERVERS ==========
async function adminFreeServers(ctx) {
  if (!isAdmin(ctx)) return;

  const args = ctx.message?.text?.split(' ') || [];
  if (args.length < 3) {
    await ctx.reply(formatQuote('⚠️ Usage: /freeservers <ram> <duration>\nExample: /freeservers 1024 24h'));
    return;
  }

  const ram = parseInt(args[1]);
  const duration = args[2];

  try {
    const users = await User.find({}, 'telegramId');
    let created = 0;

    for (const user of users) {
      try {
        await serverService.createServer(
          user.telegramId,
          'free',
          ram,
          duration,
          0,
          'FREE'
        );
        created++;
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        // Ignorer les erreurs individuelles
      }
    }

    await ctx.reply(
      formatQuote(`🆓 <b>Free servers created!</b>\n\n✅ Created: ${created} servers\n💾 RAM: ${ram}MB\n⏰ Duration: ${duration}`),
      { parse_mode: 'HTML' }
    );
  } catch (error) {
    await ctx.reply(formatQuote(`❌ Error: ${error.message}`));
  }
}

// ========== STATS ADMIN ==========
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

  const serverStats = await serverService.getServerStats();

  let message = `📊 <b>Advanced Statistics</b>\n\n`;
  message += `👥 Users: ${totalUsers}\n`;
  message += `🖥️ Servers: ${totalServers}\n`;
  message += `   ├── Active: ${serverStats.active}\n`;
  message += `   ├── Suspended: ${serverStats.suspended}\n`;
  message += `   └── Inactive: ${serverStats.inactive}\n`;
  message += `💰 Total Coins: ${totalCoins[0]?.total || 0}\n`;
  message += `💳 Transactions: ${totalTransactions}\n`;
  message += `👥 Referrals: ${totalReferrals[0]?.total || 0}\n\n`;
  message += `📈 <b>Averages:</b>\n`;
  message += `Coins/user: ${Math.round((totalCoins[0]?.total || 0) / (totalUsers || 1))}\n`;
  message += `Servers/user: ${Math.round(totalServers / (totalUsers || 1))}\n`;
  message += `Referrals/user: ${Math.round((totalReferrals[0]?.total || 0) / (totalUsers || 1))}\n\n`;

  if (serverStats.byPlan && serverStats.byPlan.length > 0) {
    message += `<b>Plans distribution:</b>\n`;
    serverStats.byPlan.forEach(p => {
      message += `   ${p._id}: ${p.count}\n`;
    });
  }

  await ctx.reply(formatQuote(message), { parse_mode: 'HTML' });
}

// ========== ATTRIBUER PLAN ==========
async function adminSetPlan(ctx) {
  if (!isAdmin(ctx)) return;

  const args = ctx.message?.text?.split(' ') || [];
  if (args.length < 3) {
    await ctx.reply(formatQuote('⚠️ Usage: /setplan <userId> <FREE|PREMIUM|VIP|OWNER>\nExample: /setplan 123456789 VIP'));
    return;
  }

  const userId = parseInt(args[1]);
  const plan = args[2].toUpperCase();

  if (!['FREE', 'PREMIUM', 'VIP', 'OWNER'].includes(plan)) {
    await ctx.reply(formatQuote('❌ Invalid plan. Choose FREE, PREMIUM, VIP, or OWNER.'));
    return;
  }

  try {
    const user = await User.findOne({ telegramId: userId });
    if (!user) {
      await ctx.reply(formatQuote('❌ User not found.'));
      return;
    }

    user.plan = plan;
    await user.save();

    await ctx.reply(
      formatQuote(`✅ Plan updated to ${plan} for ${user.firstName}\n\nNow they have access to ${config.PLANS[plan]?.servers || 1} servers.`),
      { parse_mode: 'HTML' }
    );
  } catch (error) {
    await ctx.reply(formatQuote(`❌ Error: ${error.message}`));
  }
}

// ========== SUPPRIMER SERVEUR ==========
async function adminDeleteServer(ctx) {
  if (!isAdmin(ctx)) return;

  const args = ctx.message?.text?.split(' ') || [];
  if (args.length < 2) {
    await ctx.reply(formatQuote('⚠️ Usage: /delserver <serverId>\nExample: /delserver ABC1234567'));
    return;
  }

  const serverId = args[1];

  try {
    const server = await serverService.deleteServer(serverId);
    if (!server) {
      await ctx.reply(formatQuote('❌ Server not found.'));
      return;
    }

    await ctx.reply(
      formatQuote(`✅ Server ${serverId} deleted.\n📛 Name: ${server.name}\n👤 User: ${server.userId}`),
      { parse_mode: 'HTML' }
    );
  } catch (error) {
    await ctx.reply(formatQuote(`❌ Error: ${error.message}`));
  }
}

// ========== SUPPRIMER UTILISATEUR ==========
async function adminDeleteUser(ctx) {
  if (!isAdmin(ctx)) return;

  const args = ctx.message?.text?.split(' ') || [];
  if (args.length < 2) {
    await ctx.reply(formatQuote('⚠️ Usage: /deluser <userId>\nExample: /deluser 123456789'));
    return;
  }

  const userId = parseInt(args[1]);

  try {
    const user = await User.findOne({ telegramId: userId });
    if (!user) {
      await ctx.reply(formatQuote('❌ User not found.'));
      return;
    }

    // Supprimer tous les serveurs de l'utilisateur
    await serverService.deleteUserServers(userId);

    // Supprimer l'utilisateur
    await User.deleteOne({ telegramId: userId });

    await ctx.reply(
      formatQuote(`✅ User ${user.firstName} (${userId}) deleted.\n🖥️ All their servers have been removed.`),
      { parse_mode: 'HTML' }
    );
  } catch (error) {
    await ctx.reply(formatQuote(`❌ Error: ${error.message}`));
  }
}

// ========== EXPIRATION SERVEURS ==========
async function adminCheckExpired(ctx) {
  if (!isAdmin(ctx)) return;

  try {
    const result = await serverService.checkExpiredServers();
    await ctx.reply(
      formatQuote(`⏰ <b>Expired servers check</b>\n\n${result.count} servers suspended.\n${result.servers.join(', ')}`),
      { parse_mode: 'HTML' }
    );
  } catch (error) {
    await ctx.reply(formatQuote(`❌ Error: ${error.message}`));
  }
}

// ========== EXPORT ==========
module.exports = {
  // Panel principal
  adminCommand,
  
  // Gestion utilisateurs
  adminUsers,
  adminUserInfo,
  adminDeleteUser,
  adminSetPlan,
  
  // Gestion serveurs
  adminServers,
  adminDeleteServer,
  adminFreeServers,
  adminCheckExpired,
  
  // Gestion coins
  adminAddCoins,
  adminGiftAll,
  adminCreateRedeem,
  
  // Communication
  adminBroadcast,
  
  // Statistiques
  adminStats
};
