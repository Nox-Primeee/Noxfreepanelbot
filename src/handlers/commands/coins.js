const CoinService = require('../../services/coin/CoinService');
const { formatQuote, formatBold } = require('../../utils/formatter');
const { mainKeyboard } = require('../../utils/keyboard');
const config = require('../../config');

const coinService = new CoinService();

async function coinsCommand(ctx) {
  try {
    const balance = await coinService.getBalance(ctx.from.id);
    let message = `💰 <b>Your Balance</b>\n\n`;
    message += `🪙 Coins : ${formatBold(balance.toString())}\n`;
    message += `💎 1 server = ${config.SERVER_COST} coins\n`;
    message += `🎁 Daily = ${config.DAILY_COINS} coins\n`;
    message += `👥 Referral = ${config.COINS_PER_REFERRAL} coins\n\n`;
    message += `🏪 /shop to buy coins`;

    await ctx.replyWithPhoto(
      { url: config.LOGO_URL },
      {
        caption: formatQuote(message),
        parse_mode: 'HTML',
        ...mainKeyboard
      }
    );
  } catch (error) {
    await ctx.reply(formatQuote('❌ Error retrieving balance.'));
  }
}

module.exports = { coinsCommand };
