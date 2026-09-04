const { formatQuote, formatBold } = require('../../utils/formatter');
const { shopKeyboard } = require('../../utils/keyboard');
const config = require('../../config');

async function shopCommand(ctx) {
  let message = `🏪 <b>${config.BOT_NAME} Shop</b>\n\n`;
  message += `<b>🪙 Coins:</b>\n`;
  message += `• 100 coins - 1$\n`;
  message += `• 500 coins - 5$\n`;
  message += `• 1000 coins - 10$\n`;
  message += `• 5000 coins - 20$\n\n`;
  message += `<b>💎 Plans:</b>\n`;
  message += `• Premium - 500 coins\n`;
  message += `• VIP - 1000 coins\n`;
  message += `• Owner - 5000 coins\n\n`;
  message += `📌 <b>Payment:</b>\n`;
  message += `Contact @NoxDm_bot to purchase.`;

  await ctx.replyWithPhoto(
    { url: config.LOGO_URL },
    {
      caption: formatQuote(message),
      parse_mode: 'HTML',
      ...shopKeyboard
    }
  );
}

module.exports = { shopCommand };
