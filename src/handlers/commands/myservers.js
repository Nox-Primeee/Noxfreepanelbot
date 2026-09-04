const Server = require('../../database/models/Server');
const { formatQuote, formatBold } = require('../../utils/formatter');
const { serverKeyboard } = require('../../utils/keyboard');

async function myserversCommand(ctx) {
  try {
    const servers = await Server.find({ userId: ctx.from.id });
    
    if (servers.length === 0) {
      await ctx.replyWithPhoto(
        { url: config.LOGO_URL },
        {
          caption: formatQuote('📋 <b>You have no servers yet.</b>\n\nUse /buyserver to create one.'),
          parse_mode: 'HTML',
          ...serverKeyboard
        }
      );
      return;
    }

    let message = `📋 <b>Your Servers (${servers.length})</b>\n\n`;
    servers.forEach((server, i) => {
      message += `${i + 1}. 🖥️ ${server.name}\n`;
      message += `   📦 Type: ${server.type}\n`;
      message += `   💾 RAM: ${server.memory}MB\n`;
      message += `   📊 Status: ${server.status}\n`;
      message += `   🆔 ID: ${server.serverId}\n\n`;
    });

    await ctx.replyWithPhoto(
      { url: config.LOGO_URL },
      {
        caption: formatQuote(message),
        parse_mode: 'HTML',
        ...serverKeyboard
      }
    );
  } catch (error) {
    await ctx.reply(formatQuote('❌ Error retrieving servers.'));
  }
}

module.exports = { myserversCommand };
