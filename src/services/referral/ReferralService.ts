import User from '../../database/models/User';
import { CoinService } from '../coin/CoinService';
import { config } from '../../config';
import crypto from 'crypto';

export class ReferralService {
  private coinService: CoinService;

  constructor() {
    this.coinService = new CoinService();
  }

  generateReferralCode(telegramId: number): string {
    return crypto
      .createHash('md5')
      .update(`${telegramId}-${Date.now()}`)
      .digest('hex')
      .substring(0, 8);
  }

  async processReferral(newUserId: number, referrerCode: string) {
    // Trouver le parrain par son code
    const referrer = await User.findOne({ referralCode: referrerCode });
    if (!referrer) throw new Error('Invalid referral code');

    // Vérifier que le nouveau user n'a pas déjà été parrainé
    const newUser = await User.findOne({ telegramId: newUserId });
    if (newUser?.referredBy) throw new Error('User already has a referrer');

    // Mettre à jour le nouveau user
    await User.findOneAndUpdate(
      { telegramId: newUserId },
      { referredBy: referrer.telegramId }
    );

    // Ajouter les coins au parrain
    await this.coinService.addCoins(
      referrer.telegramId,
      config.COINS_PER_REFERRAL,
      `Referral bonus for ${newUserId}`,
      'referral'
    );

    // Ajouter à la liste des parrainages
    await User.findOneAndUpdate(
      { telegramId: referrer.telegramId },
      { $push: { referrals: newUserId } }
    );

    return {
      referrer: referrer.telegramId,
      bonus: config.COINS_PER_REFERRAL
    };
  }
}
