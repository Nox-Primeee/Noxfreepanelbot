import { Context } from 'telegraf';
import User from '../../database/models/User';
import { formatQuote, formatBold, formatCode } from '../../utils/formatter';
import { referralKeyboard } from '../../utils/keyboard';
import { config } from '../../config';

export async function referralCommand(ctx: Context) {
  try {
    const user = await User.findOne({ telegramId: ctx.from!.id });
    if (!user) {
      await ctx.reply(formatQuote('❌ Utilisateur non trouvé. Utilisez /start pour créer votre compte.'));
      return;
    }

    const referralCount = user.referrals?.length || 0;
    let message = `🔗 <b>My Referral</b>\n\n`;
    message += `👤 Refer code: ${formatCode(user.referralCode)}\n`;
    message += ` Referrals : ${referralCount}\n`;
    message += `💰 Refer Bonus: ${config.COINS_PER_REFERRAL} coins\n`;
    message += `📊 Total win : ${referralCount * config.COINS_PER_REFERRAL} coins\n\n`;
    message += `📤 SHARED Refer link to earn more coins!\n`;
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
