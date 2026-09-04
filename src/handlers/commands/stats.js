const User = require('../../database/models/User');
const Server = require('../../database/models/Server');
const Transaction = require('../../database/models/Transaction');
const { formatQuote, formatBold } = require('../../utils/formatter');
const { mainKeyboard } = require('../../utils/keyboard');
const config = require('../../config');

async function statsCommand(ctx) {
  try {
    const user = await User.findOne({ telegramId: ctx.from.id });
    if (!user) {
      await ctx.reply(formatQuote('❌ Use /start to create your account.'));
      return;
    }

    const servers = await Server.countDocuments({ userId: ctx.from.id });
    const transactions = await Transaction.countDocuments({ userId: ctx.from.id });
    const referrals = user.referrals?.length || 0;

    let message = `📊 <b>Your Statistics</b>\n\n`;
    message += `👤 Name : ${formatBold(user.firstName)}\n`;
    message += `🆔 ID : ${user.telegramId}\n`;
    message += `💰 Coins : ${user.coins}\n`;
    message += `🖥️ Servers : ${servers}\n`;
    message += `👥 Referrals : ${referrals}\n`;
    message += `💳 Transactions : ${transactions}\n`;
    message += `📅 Member since : ${user.createdAt.toLocaleDateString()}\n`;
    message += `📊 Level : ${Math.floor(referrals / 5) + 1}\n\n`;
    message += `🏆 <b>Progress:</b>\n`;
    message += `Next level : ${5 - (referrals % 5)} referrals needed`;

    await ctx.replyWithPhoto(
      { url: config.LOGO_URL },
      {
        caption: formatQuote(message),
        parse_mode: 'HTML',
        ...mainKeyboard
      }
    );
  } catch (error) {
    await ctx.reply(formatQuote('❌ Error retrieving stats.'));
  }
}

module.exports = { statsCommand };
