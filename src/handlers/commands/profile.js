const User = require('../../database/models/User');
const Server = require('../../database/models/Server');
const { formatQuote, formatBold } = require('../../utils/formatter');
const { profileKeyboard } = require('../../utils/keyboard');
const config = require('../../config');

async function profileCommand(ctx) {
  try {
    const user = await User.findOne({ telegramId: ctx.from.id });
    if (!user) {
      await ctx.reply(formatQuote('❌ Use /start to create your account.'));
      return;
    }

    const servers = await Server.countDocuments({ userId: ctx.from.id });
    const referrals = user.referrals?.length || 0;
    const level = Math.floor(referrals / 5) + 1;

    let message = `👤 <b>${config.BOT_NAME} Profile</b>\n\n`;
    message += `📛 Name: ${formatBold(user.firstName)}\n`;
    message += `🆔 ID: ${user.telegramId}\n`;
    message += `💰 Coins: ${user.coins}\n`;
    message += `🖥️ Servers: ${servers}\n`;
    message += `👥 Referrals: ${referrals}\n`;
    message += `📊 Level: ${level}\n`;
    message += `📅 Joined: ${user.createdAt.toLocaleDateString()}\n\n`;
    message += `🔗 Code: <code>${user.referralCode}</code>`;

    await ctx.replyWithPhoto(
      { url: config.LOGO_URL },
      {
        caption: formatQuote(message),
        parse_mode: 'HTML',
        ...profileKeyboard
      }
    );
  } catch (error) {
    await ctx.reply(formatQuote('❌ Error retrieving profile.'));
  }
}

module.exports = { profileCommand };j
