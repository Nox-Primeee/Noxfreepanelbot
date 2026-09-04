const User = require('../../database/models/User');
const CoinService = require('../../services/coin/CoinService');
const { formatQuote, formatBold } = require('../../utils/formatter');
const { mainKeyboard } = require('../../utils/keyboard');
const config = require('../../config');

const coinService = new CoinService();

async function upgradeCommand(ctx) {
  try {
    const user = await User.findOne({ telegramId: ctx.from.id });
    if (!user) {
      await ctx.reply(formatQuote('❌ Use /start to create your account.'));
      return;
    }

    const balance = await coinService.getBalance(ctx.from.id);
    const currentPlan = user.plan || 'FREE';
    
    let message = `🆙 <b>Upgrade Your Plan</b>\n\n`;
    message += `📊 Current plan: ${formatBold(currentPlan)}\n`;
    message += `💰 Your balance: ${balance} coins\n\n`;
    message += `<b>Available Plans:</b>\n`;
    message += `🖥️ Free - 1 server - 1024MB - 0 coins\n`;
    message += `💎 Premium - 5 servers - 2048MB - 500 coins\n`;
    message += `👑 VIP - 10 servers - 4096MB - 1000 coins\n`;
    message += `⚡ Owner - 100 servers - 8192MB - 5000 coins\n\n`;
    message += `📌 Use /buyserver to purchase a plan.`;

    await ctx.replyWithPhoto(
      { url: config.LOGO_URL },
      {
        caption: formatQuote(message),
        parse_mode: 'HTML',
        ...mainKeyboard
      }
    );
  } catch (error) {
    await ctx.reply(formatQuote(`❌ Error: ${error.message}`));
  }
}

module.exports = { upgradeCommand };
