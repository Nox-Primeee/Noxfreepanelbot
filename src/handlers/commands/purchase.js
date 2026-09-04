const { formatQuote, formatBold } = require('../../utils/formatter');
const { shopKeyboard } = require('../../utils/keyboard');

async function purchaseCommand(ctx) {
  const message = `💳 <b>Purchase Coins</b>\n\n` +
    `To purchase coins, contact support:\n\n` +
    `📞 @NoxPrimeeeinc or @NoxDm_bot\n` +
    `💰 100 coins - 1$\n` +
    `💰 500 coins - 5$\n` +
    `💰 1000 coins - 10$\n` +
    `💰 5000 coins - 20$\n\n` +
    `Payment methods: PayPal, Wave, Orange Money`;

  await ctx.replyWithPhoto(
    { url: config.LOGO_URL },
    {
      caption: formatQuote(message),
      parse_mode: 'HTML',
      ...shopKeyboard
    }
  );
}

module.exports = { purchaseCommand };
