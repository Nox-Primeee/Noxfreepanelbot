const User = require('../../database/models/User');

async function verifyCommand(ctx) {
  const userId = ctx.from.id;
  const required = (process.env.REQUIRED_CHANNELS || '').split(',').filter(Boolean);
  const joined = [];

  for (const channelId of required) {
    try {
      const member = await ctx.telegram.getChatMember(channelId, userId);
      if (member.status !== 'left' && member.status !== 'kicked') {
        joined.push(channelId);
      }
    } catch (e) {
      // Le bot n'est pas membre ou le canal est privé
    }
  }

  await User.findOneAndUpdate(
    { telegramId: userId },
    { joinedChannels: joined },
    { upsert: true, new: true }
  );

  const missing = required.filter(ch => !joined.includes(ch));
  if (missing.length === 0) {
    await ctx.reply('✅ All channels verified! You can now use the bot.');
  } else {
    const list = missing.map(id => `https://t.me/c/${id.replace('-100', '')}`).join('\n');
    await ctx.reply(`⚠️ You still need to join:\n${list}`);
  }
}

module.exports = { verifyCommand };
