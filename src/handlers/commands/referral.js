const User = require('../../database/models/User');
const { formatQuote, formatBold, formatCode } = require('../../utils/formatter');
const { referralKeyboard } = require('../../utils/keyboard');
const config = require('../../config');

async function referralCommand(ctx) {
  try {
    const user = await User.findOne({ telegramId: ctx.from.id });
    if (!user) {
      await ctx.reply(formatQuote('❌ Utilisateur non trouvé. Utilisez /start pour créer votre compte.'));
      return;
    }

    const referralCount = user.referrals?.length || 0;
    let message = `🔗 <b>Système de parrainage</b>\n\n`;
    message += `👤 Votre code : ${formatCode(user.referralCode)}\n`;
    message += `👥 Parrainages : ${referralCount}\n`;
    message += `💰 Bonus par parrainage : ${config.COINS_PER_REFERRAL} coins\n`;
    message += `📊 Total gagné : ${referralCount * config.COINS_PER_REFERRAL} coins\n\n`;
    message += `📤 Partagez votre code avec vos amis !\n`;
    message += `🔗 https://t.me/${ctx.botInfo.username}?start=${user.referralCode}`;

    await ctx.replyWithPhoto(
      { url: config.LOGO_URL },
      {
        caption: formatQuote(message),
        parse_mode: 'HTML',
        ...referralKeyboard
      }
    );
  } catch (error) {
    await ctx.reply(formatQuote('❌ Erreur lors de la récupération de vos informations.'));
  }
}

module.exports = { referralCommand };
