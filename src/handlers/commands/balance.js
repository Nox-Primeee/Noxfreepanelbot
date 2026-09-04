const CoinService = require('../../services/coin/CoinService');
const { formatQuote, formatBold } = require('../../utils/formatter');
const { mainKeyboard } = require('../../utils/keyboard');
const config = require('../../config');

const coinService = new CoinService();

async function balanceCommand(ctx) {
  try {
    const balance = await coinService.getBalance(ctx.from.id);
    let message = `💰 <b>My ACCOUNT</b>\n\n`;
    message += `🪙 Balance: ${formatBold(balance.toString())}\n`;
    message += `💎 Coins per server: ${config.SERVER_COST}\n`;

    await ctx.replyWithPhoto(
      { url: config.LOGO_URL },
      {
        caption: formatQuote(message),
        parse_mode: 'HTML',
        ...mainKeyboard
      }
    );
  } catch (error) {
    await ctx.reply(formatQuote('❌ Erreur lors de la récupération de votre solde.'));
  }
}

module.exports = { balanceCommand };
