const CoinService = require('../../services/coin/CoinService');
const PterodactylService = require('../../services/pterodactyl/PterodactylService');
const { formatQuote, formatBold } = require('../../utils/formatter');
const { createServerKeyboard, mainKeyboard } = require('../../utils/keyboard');
const config = require('../../config');

const coinService = new CoinService();
const pteroService = new PterodactylService();

async function createCommand(ctx) {
  try {
    const balance = await coinService.getBalance(ctx.from.id);
    let message = `🆕 <b>Création de serveur</b>\n\n`;
    message += `💰 Coins nécessaires : ${config.SERVER_COST}\n`;
    message += `🪙 Votre solde : ${balance}\n\n`;
    message += `📌 Choisissez le type de serveur :`;

    if (balance < config.SERVER_COST) {
      message += `\n\n⚠️ Solde insuffisant ! Vous avez besoin de ${config.SERVER_COST} coins.`;
    }

    await ctx.replyWithPhoto(
      { url: config.LOGO_URL },
      {
        caption: formatQuote(message),
        parse_mode: 'HTML',
        ...createServerKeyboard
      }
    );
  } catch (error) {
    await ctx.reply(formatQuote(`❌ Erreur : ${error.message}`));
  }
}

async function createServerType(ctx, type) {
  try {
    const userId = ctx.from.id;
    const balance = await coinService.getBalance(userId);

    if (balance < config.SERVER_COST) {
      await ctx.reply(formatQuote(`⚠️ Solde insuffisant ! Vous avez besoin de ${config.SERVER_COST} coins.`));
      return;
    }

    await coinService.spendCoins(userId, config.SERVER_COST, `Création serveur ${type}`);

    const server = await pteroService.createServer(
      userId,
      `${type}-${Date.now()}`,
      type,
      1024
    );

    let message = `✅ <b>Serveur créé avec succès !</b>\n\n`;
    message += `🖥️ Type : ${type}\n`;
    message += `🆔 ID : ${server.id || 'N/A'}\n`;
    message += `💰 Coins restants : ${await coinService.getBalance(userId)}`;

    await ctx.replyWithPhoto(
      { url: config.LOGO_URL },
      {
        caption: formatQuote(message),
        parse_mode: 'HTML',
        ...mainKeyboard
      }
    );
  } catch (error) {
    await ctx.reply(formatQuote(`❌ Erreur lors de la création : ${error.message}`));
  }
}

module.exports = { createCommand, createServerType };
