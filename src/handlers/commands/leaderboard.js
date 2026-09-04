const User = require('../../database/models/User');
const { formatQuote, formatBold } = require('../../utils/formatter');
const { mainKeyboard } = require('../../utils/keyboard');

async function leaderboardCommand(ctx) {
  try {
    const topCoins = await User.find()
      .sort({ coins: -1 })
      .limit(5)
      .select('firstName coins');

    const topReferrals = await User.find()
      .sort({ referrals: -1 })
      .limit(5)
      .select('firstName referrals');

    let message = `🏆 <b>NOX Leaderboard</b>\n\n`;
    
    message += `💰 <b>Top Coins:</b>\n`;
    topCoins.forEach((user, i) => {
      message += `${i + 1}. ${user.firstName} - ${user.coins} coins\n`;
    });

    message += `\n👥 <b>Top Referrals:</b>\n`;
    topReferrals.forEach((user, i) => {
      const count = user.referrals?.length || 0;
      message += `${i + 1}. ${user.firstName} - ${count} referrals\n`;
    });

    await ctx.replyWithPhoto(
      { url: config.LOGO_URL },
      {
        caption: formatQuote(message),
        parse_mode: 'HTML',
        ...mainKeyboard
      }
    );
  } catch (error) {
    await ctx.reply(formatQuote('❌ Error retrieving leaderboard.'));
  }
}

module.exports = { leaderboardCommand };
