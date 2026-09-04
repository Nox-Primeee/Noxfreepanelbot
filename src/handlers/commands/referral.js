const User = require('../../database/models/User');
const { formatQuote, formatBold, formatCode } = require('../../utils/formatter');
const { referralKeyboard } = require('../../utils/keyboard');
const config = require('../../config');

async function referralCommand(ctx) {
  try {
    const user = await User.findOne({ telegramId: ctx.from.id });
    if (!user) {
      await ctx.reply(formatQuote('❌ Use /start to create your account.'));
      return;
    }

    const referralCount = user.referrals?.length || 0;
    let message = `🔗 <b>Referral System</b>\n\n`;
    message += `👤 Your code : ${formatCode(user.referralCode)}\n`;
    message += `👥 Referrals : ${referralCount}\n`;
    message += `💰 Bonus per referral : ${config.COINS_PER_REFERRAL} coins\n`;
    message += `📊 Total earned : ${referralCount * config.COINS_PER_REFERRAL} coins\n\n`;
    message += `📤 Share your code with friends!\n`;
    message += `🔗 https://t.me/${ctx.botInfo.username}?start=${user.referralCode}\n\n`;
    message += `🏆 <b>Top Referrers:</b>\n`;

    const topReferrers = await User.find()
      .sort({ referrals: -1 })
      .limit(5)
      .select('firstName referrals');

    topReferrers.forEach((u, i) => {
      message += `${i + 1}. ${u.firstName} - ${u.referrals?.length || 0} referrals\n`;
    });

    await ctx.replyWithPhoto(
      { url: config.LOGO_URL },
      {
        caption: formatQuote(message),
        parse_mode: 'HTML',
        ...referralKeyboard
      }
    );
  } catch (error) {
    await ctx.reply(formatQuote('❌ Error retrieving referral info.'));
  }
}

module.exports = { referralCommand };
