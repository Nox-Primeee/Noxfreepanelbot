const crypto = require('crypto');
const User = require('../../database/models/User');
const CoinService = require('../coin/CoinService');
const config = require('../../config');

class ReferralService {
  constructor() {
    this.coinService = new CoinService();
  }

  generateReferralCode(telegramId) {
    return crypto
      .createHash('md5')
      .update(`${telegramId}-${Date.now()}`)
      .digest('hex')
      .substring(0, 8);
  }

  async processReferral(newUserId, referrerCode) {
    const referrer = await User.findOne({ referralCode: referrerCode });
    if (!referrer) throw new Error('Invalid referral code');

    const newUser = await User.findOne({ telegramId: newUserId });
    if (newUser?.referredBy) throw new Error('User already has a referrer');

    await User.findOneAndUpdate(
      { telegramId: newUserId },
      { referredBy: referrer.telegramId }
    );

    await this.coinService.addCoins(
      referrer.telegramId,
      config.COINS_PER_REFERRAL,
      `Referral bonus for ${newUserId}`,
      'referral'
    );

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

module.exports = ReferralService;
