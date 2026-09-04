import { Context } from 'telegraf';
import { CoinService } from '../../services/coin/CoinService';
import { PterodactylService } from '../../services/pterodactyl/PterodactylService';
import { formatQuote, formatBold } from '../../utils/formatter';
import { createServerKeyboard } from '../../utils/keyboard';
import { config } from '../../config';

const coinService = new CoinService();
const pteroService = new PterodactylService();

export async function createCommand(ctx: Context) {
  try {
    const balance = await coinService.getBalance(ctx.from!.id);
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
    await ctx.reply(formatQuote('❌ Erreur lors de la préparation de la création.'));
  }
}

export async function createServerType(ctx: Context, type: string) {
  try {
    const userId = ctx.from!.id;
    const balance = await coinService.getBalance(userId);

    if (balance < config.SERVER_COST) {
      await ctx.reply(formatQuote(`⚠️ Solde insuffisant ! Vous avez besoin de ${config.SERVER_COST} coins.`));
      return;
    }

    // Déduire les coins
    await coinService.spendCoins(userId, config.SERVER_COST, `Création serveur ${type}`);

    // Créer le serveur via Pterodactyl
    const server = await pteroService.createServer(
      userId,
      `${type}-${Date.now()}`,
      type,
      1024 // RAM par défaut
    );

    let message = `✅ <b>Server create successfully !</b>\n\n`;
    message += `🖥️ Type : ${type}\n`;
    message += `🆔 ID : ${server.id}\n`;
    message += `🌐 IP : ${server.ip}\n`;
    message += `🔑 Port : ${server.port}\n\n`;
    message += `💰 Balance : ${await coinService.getBalance(userId)}`;

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
