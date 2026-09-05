const User = require('../database/models/User');

const REQUIRED_CHANNELS = (process.env.REQUIRED_CHANNELS || '').split(',').filter(Boolean);

async function checkChannel(ctx, next) {
  const userId = ctx.from.id;
  let user = await User.findOne({ telegramId: userId });

  // Si l'utilisateur n'existe pas encore, on le laisse passer pour /start
  if (!user && ctx.message?.text === '/start') {
    return next();
  }

  if (!user) {
    await ctx.reply('❌ Please use /start to register first.');
    return;
  }

  // Vérifier si l'utilisateur a rejoint tous les canaux requis
  const joined = user.joinedChannels || [];
  const missing = REQUIRED_CHANNELS.filter(ch => !joined.includes(ch));

  if (missing.length > 0) {
    const channelsList = missing.map(id => `https://t.me/c/${id.replace('-100', '')}`).join('\n');
    await ctx.reply(
      `⚠️ You must join the following channels to use this bot:\n${channelsList}\n\n` +
      `After joining, send /verify to confirm.`
    );
    return;
  }

  // Vérifier le nombre de parrainages (sauf pour l'admin)
  if (ctx.from.id !== parseInt(process.env.ADMIN_ID)) {
    const referrals = user.referrals?.length || 0;
    if (referrals < parseInt(process.env.REFERRALS_REQUIRED || 5)) {
      await ctx.reply(
        `⚠️ You need at least ${process.env.REFERRALS_REQUIRED} referrals to create servers.\n` +
        `Current: ${referrals}\nUse /referral to get your link.`
      );
      return;
    }
  }

  await next();
}

module.exports = { checkChannel };
