const { formatQuote, formatBold } = require('../../utils/formatter');
const { mainKeyboard } = require('../../utils/keyboard');
const config = require('../../config');

async function helpCommand(ctx) {
  let message = `❓ <b>Aide - ${config.BOT_NAME}</b>\n\n`;
  message += `<b>Commandes disponibles :</b>\n`;
  message += `📌 /start - Démarrer le bot\n`;
  message += `💰 /balance - Voir votre solde\n`;
  message += `🆕 /create - Créer un serveur\n`;
  message += `🔗 /referral - Système de parrainage\n`;
  message += `📊 /servers - Voir vos serveurs\n`;
  message += `❓ /help - Cette aide\n\n`;
  message += `<b>Système de coins :</b>\n`;
  message += `🪙 ${config.SERVER_COST} coins = 1 serveur\n`;
  message += `👥 ${config.COINS_PER_REFERRAL} coins par parrainage\n`;
  message += `🎁 ${config.STARTING_COINS} coins de bienvenue\n\n`;
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

module.exports = { helpCommand };
