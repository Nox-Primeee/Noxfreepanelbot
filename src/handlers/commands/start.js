const User = require('../../database/models/User');
const ReferralService = require('../../services/referral/ReferralService');
const CoinService = require('../../services/coin/CoinService');
const { formatQuote, formatBold } = require('../../utils/formatter');
const { mainKeyboard } = require('../../utils/keyboard');
const config = require('../../config');

const referralService = new ReferralService();
const coinService = new CoinService();

async function startCommand(ctx) {
  const user = ctx.from;
  const text = ctx.message?.text || '';
  const args = text.split(' ');
  const referralCode = args[1];

  let existingUser = await User.findOne({ telegramId: user.id });

  if (!existingUser) {
    const newUser = new User({
      telegramId: user.id,
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      referralCode: referralService.generateReferralCode(user.id),
      coins: config.STARTING_COINS
    });

    await newUser.save();

    let message = `🌟 <b>Bienvenue sur ${config.BOT_NAME} !</b>\n\n`;
    message += `👤 ${formatBold(user.first_name)}, votre compte a été créé avec succès.\n`;
    message += `💰 Vous avez reçu ${config.STARTING_COINS} coins de bienvenue.\n\n`;
    message += `📌 <b>Commandes disponibles :</b>\n`;
    message += `• /balance - Voir votre solde\n`;
    message += `• /create - Créer un serveur\n`;
    message += `• /referral - Système de parrainage\n`;
    message += `• /help - Aide complète`;

    if (referralCode) {
      try {
        await referralService.processReferral(user.id, referralCode);
        message += `\n\n🎉 <b>Parrainage réussi !</b>\n`;
        message += `💰 Vous avez reçu ${config.STARTING_COINS} coins de bienvenue.\n`;
        message += `👑 Votre parrain a reçu ${config.COINS_PER_REFERRAL} coins.`;
      } catch (error) {
        message += `\n\n⚠️ Erreur lors du parrainage: ${error.message}`;
      }
    }

    await ctx.replyWithPhoto(
      { url: config.LOGO_URL },
      {
        caption: formatQuote(message),
        parse_mode: 'HTML',
        ...mainKeyboard
      }
    );
  } else {
    const balance = await coinService.getBalance(user.id);
    let message = `👋 <b>Bonjour ${user.first_name} !</b>\n\n`;
    message += `💰 Votre solde : ${balance} coins\n`;
    message += `🔗 Code de parrainage : <code>${existingUser.referralCode}</code>\n\n`;
    message += `📌 Que souhaitez-vous faire ?`;

    await ctx.replyWithPhoto(
      { url: config.LOGO_URL },
      {
        caption: formatQuote(message),
        parse_mode: 'HTML',
        ...mainKeyboard
      }
    );
  }
}

module.exports = { startCommand };
