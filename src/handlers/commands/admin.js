const User = require('../../database/models/User');
const Transaction = require('../../database/models/Transaction');
const { formatQuote, formatBold } = require('../../utils/formatter');
const { adminKeyboard } = require('../../utils/keyboard');
const config = require('../../config');

async function adminCommand(ctx) {
  if (ctx.from.id !== config.ADMIN_ID) {
    await ctx.reply(formatQuote('⛔ Accès réservé à l\'administrateur.'));
    return;
  }

  const totalUsers = await User.countDocuments();
  const totalTransactions = await Transaction.countDocuments();
  const totalCoins = await User.aggregate([
    { $group: { _id: null, total: { $sum: '$coins' } } }
  ]);

  let message = `👑 <b>Panel Admin</b>\n\n`;
  message += `📊 <b>Statistiques :</b>\n`;
  message += `👥 Utilisateurs : ${totalUsers}\n`;
  message += `💳 Transactions : ${totalTransactions}\n`;
  message += `💰 Coins totaux : ${totalCoins[0]?.total || 0}\n\n`;
  message += `📌 Que souhaitez-vous gérer ?`;

  await ctx.replyWithPhoto(
    { url: config.LOGO_URL },
    {
      caption: formatQuote(message),
      parse_mode: 'HTML',
      ...adminKeyboard
    }
  );
}

async function adminUsers(ctx) {
  if (ctx.from.id !== config.ADMIN_ID) return;

  const users = await User.find().sort({ createdAt: -1 }).limit(10);
  let message = `👥 <b>Derniers utilisateurs</b>\n\n`;

  users.forEach((user, index) => {
    message += `${index + 1}. ${user.firstName} (${user.telegramId})\n`;
    message += `   💰 ${user.coins} coins | 🔗 ${user.referralCode}\n`;
  });

  await ctx.reply(formatQuote(message), { parse_mode: 'HTML' });
}

async function adminCoins(ctx) {
  if (ctx.from.id !== config.ADMIN_ID) return;

  await ctx.reply(
    formatQuote('💰 <b>Gestion des coins</b>\n\nUtilisez : /addcoins <id> <montant>'),
    { parse_mode: 'HTML' }
  );
}

async function addCoinsCommand(ctx) {
  if (ctx.from.id !== config.ADMIN_ID) return;

  const args = ctx.message?.text?.split(' ') || [];
  if (args.length < 3) {
    await ctx.reply(formatQuote('⚠️ Utilisation : /addcoins <telegramId> <montant>'));
    return;
  }

  const userId = parseInt(args[1]);
  const amount = parseInt(args[2]);

  try {
    const user = await User.findOne({ telegramId: userId });
    if (!user) {
      await ctx.reply(formatQuote('❌ Utilisateur non trouvé.'));
      return;
    }

    user.coins += amount;
    await user.save();

    await ctx.reply(
      formatQuote(`✅ ${amount > 0 ? '+' : ''}${amount} coins ajoutés à ${user.firstName}\n💰 Nouveau solde : ${user.coins}`),
      { parse_mode: 'HTML' }
    );
  } catch (error) {
    await ctx.reply(formatQuote(`❌ Erreur : ${error.message}`));
  }
}

module.exports = {
  adminCommand,
  adminUsers,
  adminCoins,
  addCoinsCommand
};
