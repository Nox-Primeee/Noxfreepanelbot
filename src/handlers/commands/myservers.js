const Server = require('../../database/models/Server');
const { formatQuote, formatBold } = require('../../utils/formatter');
const { Markup } = require('telegraf');

async function myserversCommand(ctx) {
  try {
    const servers = await Server.find({ userId: ctx.from.id });
    
    if (servers.length === 0) {
      await ctx.replyWithPhoto(
        { url: config.LOGO_URL },
        {
          caption: formatQuote('📋 <b>You have no servers.</b>\n\nUse /buyserver to create one.'),
          parse_mode: 'HTML'
        }
      );
      return;
    }

    let message = `📋 <b>Your Servers (${servers.length})</b>\n\n`;
    servers.forEach((server, i) => {
      message += `${i + 1}. 🖥️ ${server.name}\n`;
      message += `   📦 Type: ${server.type}\n`;
      message += `   💾 RAM: ${server.ram}MB\n`;
      message += `   ⏰ Duration: ${server.duration}\n`;
      message += `   👤 User: <code>${server.username}</code>\n`;
      message += `   🔑 Pass: <code>${server.password}</code>\n`;
      message += `   🌐 ${server.domain}\n`;
      message += `   📅 Expires: ${server.expiresAt.toLocaleDateString()}\n`;
      message += `   📊 Status: ${server.status}\n\n`;
    });

    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback('🔄 Refresh', 'myservers')],
      [Markup.button.callback('🔙 Back', 'back_main')]
    ]);

    await ctx.replyWithPhoto(
      { url: config.LOGO_URL },
      {
        caption: formatQuote(message),
        parse_mode: 'HTML',
        ...keyboard
      }
    );
  } catch (error) {
    await ctx.reply(formatQuote('❌ Error retrieving servers.'));
  }
}

module.exports = { myserversCommand };
