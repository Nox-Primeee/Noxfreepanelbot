import { Context } from 'telegraf';
import User from '../../database/models/User';
import { ReferralService } from '../../services/referral/ReferralService';
import { CoinService } from '../../services/coin/CoinService';
import { formatQuote, formatWithLogo, formatBold } from '../../utils/formatter';
import { mainKeyboard } from '../../utils/keyboard';
import { config } from '../../config';

const referralService = new ReferralService();
const coinService = new CoinService();

export async function startCommand(ctx: Context) {
  const user = ctx.from!;
  // ✅ CORRIGÉ - Vérification de text
  const text = (ctx.message as any)?.text || '';
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
        const result = await referralService.processReferral(user.id, referralCode);
        message += `\n\n🎉 <b>Parrainage réussi !</b>\n`;
        message += `💰 Vous avez reçu ${config.STARTING_COINS} coins de bienvenue.\n`;
        message += `👑 Votre parrain a reçu ${config.COINS_PER_REFERRAL} coins.`;
      } catch (error: any) {
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
