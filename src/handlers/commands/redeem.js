const RedeemCode = require('../../database/models/RedeemCode');
const CoinService = require('../../services/coin/CoinService');
const { formatQuote, formatBold } = require('../../utils/formatter');
const { mainKeyboard } = require('../../utils/keyboard');

const coinService = new CoinService();

async function redeemCommand(ctx) {
  const args = ctx.message?.text?.split(' ') || [];
  if (args.length < 2) {
    await ctx.reply(formatQuote('❌ Usage: /redeem <CODE>\n\nExample: /redeem NOX5XDX5091'));
    return;
  }

  const code = args[1].toUpperCase();
  
  try {
    const redeem = await RedeemCode.findOne({ code });
    if (!redeem) {
      await ctx.reply(formatQuote('❌ Invalid or expired code.'));
      return;
    }

    if (redeem.usedBy.includes(ctx.from.id)) {
      await ctx.reply(formatQuote('❌ You already used this code.'));
      return;
    }

    if (redeem.usedBy.length >= redeem.maxUses) {
      await ctx.reply(formatQuote('❌ This code has reached its usage limit.'));
      return;
    }

    await coinService.addCoins(ctx.from.id, redeem.reward, `Redeem code: ${code}`);
    
    await RedeemCode.findOneAndUpdate(
      { code },
      { $push: { usedBy: ctx.from.id } }
    );

    const balance = await coinService.getBalance(ctx.from.id);
    await ctx.replyWithPhoto(
      { url: config.LOGO_URL },
      {
        caption: formatQuote(`🎉 <b>Code redeemed successfully!</b>\n\n+${redeem.reward} coins\n💰 New balance: ${balance} coins`),
        parse_mode: 'HTML',
        ...mainKeyboard
      }
    );
  } catch (error) {
    await ctx.reply(formatQuote(`❌ Error: ${error.message}`));
  }
}

module.exports = { redeemCommand };
