import { Context } from 'telegraf';
import { CoinService } from '../../services/coin/CoinService';

const coinService = new CoinService();

export async function balanceCommand(ctx: Context) {
  try {
    const balance = await coinService.getBalance(ctx.from!.id);
    await ctx.reply(
      `💰 Votre solde : ${balance} coins\n\n` +
      `📊 Utilisez /referral pour obtenir votre code de parrainage.`
    );
  } catch (error) {
    await ctx.reply('❌ Erreur lors de la récupération de votre solde.');
  }
}
