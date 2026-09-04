const User = require('../../database/models/User');
const CoinService = require('../../services/coin/CoinService');
const { formatQuote } = require('../../utils/formatter');
const { mainKeyboard } = require('../../utils/keyboard');
const config = require('../../config');

const coinService = new CoinService();

async function dailyCommand(ctx) {
  try {
    const user = await User.findOne({ telegramId: ctx.from.id });
    if (!user) {
      await ctx.reply(formatQuote('❌ Use /start to create your account.'));
      return;
    }

    const now = new Date();
    const lastDaily = user.lastDaily || new Date(0);
    const hoursSince = (now - lastDaily) / (1000 * 60 * 60);

    if (hoursSince < 24) {
      const remaining = Math.floor(24 - hoursSince);
      await ctx.reply(formatQuote(`⏳ You already claimed your daily coins.\nNext daily in ${remaining} hours.`));
      return;
    }

    await coinService.addCoins(ctx.from.id, config.DAILY_COINS, 'Daily reward');
    await User.findOneAndUpdate(
      { telegramId: ctx.from.id },
      { lastDaily: now }
    );

    const balance = await coinService.getBalance(ctx.from.id);
    await ctx.replyWithPhoto(
      { url: config.LOGO_URL },
      {
        caption: formatQuote(`🎉 <b>Daily Claimed!</b>\n\n+${config.DAILY_COINS} coins\n💰 New balance: ${balance} coins`),
        parse_mode: 'HTML',
        ...mainKeyboard
      }
    );
  } catch (error) {
    await ctx.reply(formatQuote('❌ Daily claim error.'));
  }
}

module.exports = { dailyCommand };
