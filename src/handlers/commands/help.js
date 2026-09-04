const { formatQuote, formatBold } = require('../../utils/formatter');
const { mainKeyboard } = require('../../utils/keyboard');
const config = require('../../config');

async function helpCommand(ctx) {
  let message = `❓ <b>${config.BOT_NAME} Help</b>\n\n`;
  message += `<b>📌 User Commands:</b>\n`;
  message += `/menu - Main menu\n`;
  message += `/coins - Check balance\n`;
  message += `/daily - Claim daily (${config.DAILY_COINS}/day)\n`;
  message += `/referral - Referral system\n`;
  message += `/stats - Your statistics\n`;
  message += `/profile - Your profile\n`;
  message += `/myid - Your Telegram ID\n`;
  message += `/buyserver - Buy a server\n`;
  message += `/myservers - View your servers\n`;
  message += `/shop - Shop\n`;
  message += `/redeem - Use a code\n`;
  message += `/leaderboard - Rankings\n\n`;
  message += `<b>💰 Coin System:</b>\n`;
  message += `🎁 Welcome: ${config.STARTING_COINS} coins\n`;
  message += `📅 Daily: ${config.DAILY_COINS} coins\n`;
  message += `👥 Referral: ${config.COINS_PER_REFERRAL} coins\n`;
  message += `🖥️ Server: ${config.SERVER_COST} coins\n\n`;
  message += `📞 <b>Support:</b> @NoxDm_bot`;

  await ctx.replyWithPhoto(
    { url: config.LOGO_URL },
    {
      caption: formatQuote(message),
      parse_mode: 'HTML',
      ...mainKeyboard
    }
  );
}

module.exports = { helpCommand };
