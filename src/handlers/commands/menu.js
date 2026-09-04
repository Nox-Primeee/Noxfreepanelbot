const { formatQuote } = require('../../utils/formatter');
const { mainKeyboard } = require('../../utils/keyboard');
const config = require('../../config');

async function menuCommand(ctx) {
  const message = `🏠 <b>${config.BOT_NAME}</b>\n\n` +
    `Welcome to the management panel!\n` +
    `Use the buttons below to navigate.\n\n` +
    `📌 <b>Quick Commands:</b>\n` +
    `/coins - Check your balance\n` +
    `/daily - Claim daily coins\n` +
    `/referral - Referral system\n` +
    `/buyserver - Buy a server\n` +
    `/myservers - View your servers`;

  await ctx.replyWithPhoto(
    { url: config.LOGO_URL },
    {
      caption: formatQuote(message),
      parse_mode: 'HTML',
      ...mainKeyboard
    }
  );
}

module.exports = { menuCommand };
