import { Context } from 'telegraf';
import { formatQuote, formatBold } from '../../utils/formatter';
import { mainKeyboard } from '../../utils/keyboard';

export async function helpCommand(ctx: Context) {
  let message = `❓ <b>Aide - ${config.BOT_NAME}</b>\n\n`;
  message += `<b>Commandes disponibles :</b>\n`;
  message += `📌 /start - Démarrer le bot\n`;
  message += `💰 /balance - Voir votre solde\n`;
  message += `🆕 /create - Créer un serveur\n`;
  message += `🔗 /referral - Système de parrainage\n`;
  message += `📊 /servers - Voir vos serveurs\n`;
  message += `❓ /help - Cette aide\n\n`;
  message += `<b>Système de coins :</b>\n`;
  message += `🪙 200 coins = 1 serveur\n`;
  message += `👥 50 coins par parrainage\n`;
  message += `🎁 100 coins de bienvenue\n\n`;
  message += `📞 Support : @Nox-primeee`;

  await ctx.replyWithPhoto(
    { url: config.LOGO_URL },
    {
      caption: formatQuote(message),
      parse_mode: 'HTML',
      ...mainKeyboard
    }
  );
}
