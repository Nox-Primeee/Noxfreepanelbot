const { formatQuote, formatBold } = require('../../utils/formatter');

async function myidCommand(ctx) {
  const message = `🆔 <b>Your Telegram ID</b>\n\n` +
    `ID: ${formatBold(ctx.from.id.toString())}\n` +
    `Name: ${ctx.from.first_name}\n` +
    `Username: ${ctx.from.username || 'None'}`;

  await ctx.reply(formatQuote(message), { parse_mode: 'HTML' });
}

module.exports = { myidCommand };
