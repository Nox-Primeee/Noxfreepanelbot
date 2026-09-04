const CoinService = require('../../services/coin/CoinService');
const ServerService = require('../../services/server/ServerService');
const { formatQuote, formatBold } = require('../../utils/formatter');
const { serverKeyboard } = require('../../utils/keyboard');
const config = require('../../config');

const coinService = new CoinService();
const serverService = new ServerService();

async function buyserverCommand(ctx) {
  try {
    const balance = await coinService.getBalance(ctx.from.id);
    let message = `🆕 <b>Buy a Server</b>\n\n`;
    message += `💰 Your balance : ${balance} coins\n`;
    message += `💎 Price : ${config.SERVER_COST} coins\n\n`;
    message += `<b>Available Plans:</b>\n`;
    message += `🖥️ Free - 1 server - 1024MB\n`;
    message += `💎 Premium - 5 servers - 2048MB\n`;
    message += `👑 VIP - 10 servers - 4096MB\n`;
    message += `⚡ Owner - 100 servers - 8192MB\n\n`;
    message += `📌 Choose your plan below:`;

    await ctx.replyWithPhoto(
      { url: config.LOGO_URL },
      {
        caption: formatQuote(message),
        parse_mode: 'HTML',
        ...serverKeyboard
      }
    );
  } catch (error) {
    await ctx.reply(formatQuote(`❌ Error: ${error.message}`));
  }
}

async function buyServerType(ctx, type) {
  try {
    const userId = ctx.from.id;
    const balance = await coinService.getBalance(userId);
    const plan = config.PLANS[type.toUpperCase()];

    if (!plan) {
      await ctx.reply(formatQuote('❌ Invalid plan.'));
      return;
    }

    if (balance < plan.price) {
      await ctx.reply(formatQuote(`⚠️ Insufficient balance!\n💰 Price: ${plan.price} coins\n🪙 Your balance: ${balance}`));
      return;
    }

    const server = await serverService.createServer(userId, type, plan);
    await coinService.spendCoins(userId, plan.price, `Server purchase ${type}`);

    let message = `✅ <b>${type.charAt(0).toUpperCase() + type.slice(1)} server created!</b>\n\n`;
    message += `🆔 ID : ${server.serverId}\n`;
    message += `💾 RAM : ${plan.memory}MB\n`;
    message += `📦 Plan : ${plan.name}\n`;
    message += `💰 Remaining coins : ${await coinService.getBalance(userId)}`;

    await ctx.replyWithPhoto(
      { url: config.LOGO_URL },
      {
        caption: formatQuote(message),
        parse_mode: 'HTML',
        ...serverKeyboard
      }
    );
  } catch (error) {
    await ctx.reply(formatQuote(`❌ Purchase error: ${error.message}`));
  }
}

module.exports = { buyserverCommand, buyServerType };
