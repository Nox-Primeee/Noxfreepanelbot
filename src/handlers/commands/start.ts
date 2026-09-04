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

    let message = `<b> ${config.BOT_NAME}</b>\n\n`;
    message += `👤 User: ${formatBold(user.first_name)}\n`;
    message += `💰 Balance :${config.STARTING_COINS} coins.\n Support: @nox_chh\n\n`;
    message += ` <b>COMMANDS</b>\n`;
    message += `• /balance\n`;
    message += `• /create \n`;
    message += `• /referral \n`;
    message += `• /help `;

    if (referralCode) {
      try {
        const result = await referralService.processReferral(user.id, referralCode);
        message += `\n\n🎉 <b>New User Referrals!</b>\n`;
        message += `💰 You receive ${config.STARTING_COINS} cois\n`;
        message += ` Your Refer Receive: ${config.COINS_PER_REFERRAL} coins.`;
      } catch (error) {
        message += `\n\n⚠️ Error: ${error.message}`;
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
    let message = `<b>User: ${user.first_name} !</b>\n\n`;
    message += `💰 Balance: ${balance} coins\n`;
    message += `🔗 Referral link: <code>${existingUser.referralCode}</code>\n\n`;
    message += `Support: @nox_chh`;

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
