import { Context } from 'telegraf';
import { CoinService } from '../../services/coin/CoinService';
import { formatQuote, formatBold } from '../../utils/formatter';
import { mainKeyboard } from '../../utils/keyboard';

const coinService = new CoinService();

export async function balanceCommand(ctx: Context) {
  try {
    const balance = await coinService.getBalance(ctx.from!.id);
    let message = ` <b>NOX PANEL BOT</b>\n\n`;
    message += `🪙 Balance : ${formatBold(balance.toString())}\n`;
    message += `💎 Coins For create Servers: 200\n`;
    message += `📊 Total transactions : /transactions`;

    await ctx.replyWithPhoto(
      { url: config.LOGO_URL },
      {
        caption: formatQuote(message),
        parse_mode: 'HTML',
        ...mainKeyboard
      }
    );
  } catch (error) {
    await ctx.reply(formatQuote('❌ Erreur lors de la récupération de votre solde.'));
  }
}
