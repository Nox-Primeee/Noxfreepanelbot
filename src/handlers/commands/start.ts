import { Context } from 'telegraf';
import User from '../../database/models/User';
import { ReferralService } from '../../services/referral/ReferralService';
import { config } from '../../config';

const referralService = new ReferralService();

export async function startCommand(ctx: Context) {
  const user = ctx.from!;
  const text = ctx.message?.text || '';
  const args = text.split(' ');
  const referralCode = args[1];

  // Vérifier si l'utilisateur existe
  let existingUser = await User.findOne({ telegramId: user.id });

  if (!existingUser) {
    // Créer un nouvel utilisateur
    const newUser = new User({
      telegramId: user.id,
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      referralCode: referralService.generateReferralCode(user.id),
      coins: config.STARTING_COINS
    });

    await newUser.save();

    // Traiter le parrainage si un code est fourni
    if (referralCode) {
      try {
        const result = await referralService.processReferral(user.id, referralCode);
        await ctx.reply(
          `🎉 Bienvenue ! Vous avez été parrainé par un autre utilisateur.\n` +
          `💰 Vous recevez ${config.STARTING_COINS} coins de bienvenue !`
        );
      } catch (error) {
        await ctx.reply(`⚠️ Erreur lors du parrainage: ${error.message}`);
      }
    } else {
      await ctx.reply(
        `👋 Bienvenue ${user.first_name} !\n\n` +
        `💰 Vous avez reçu ${config.STARTING_COINS} coins de bienvenue.\n` +
        `📝 Utilisez /help pour voir les commandes disponibles.`
      );
    }
  } else {
    await ctx.reply(`👋 Bonjour ${user.first_name} ! Bienvenue à nouveau.`);
  }
}
