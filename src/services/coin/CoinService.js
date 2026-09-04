const User = require('../../database/models/User');
const Transaction = require('../../database/models/Transaction');
const config = require('../../config');

class CoinService {
  async getBalance(telegramId) {
    const user = await User.findOne({ telegramId });
    return user?.coins || 0;
  }

  async addCoins(telegramId, amount, description, type = 'earn') {
    const user = await User.findOneAndUpdate(
      { telegramId },
      { $inc: { coins: amount } },
      { new: true }
    );

    if (!user) throw new Error('User not found');

    await Transaction.create({
      userId: telegramId,
      type,
      amount,
      description
    });

    return user.coins;
  }

  async spendCoins(telegramId, amount, description) {
    const user = await User.findOne({ telegramId });
    if (!user) throw new Error('User not found');
    if (user.coins < amount) throw new Error('Insufficient coins');

    const updatedUser = await User.findOneAndUpdate(
      { telegramId },
      { $inc: { coins: -amount } },
      { new: true }
    );

    await Transaction.create({
      userId: telegramId,
      type: 'spend',
      amount: -amount,
      description
    });

    return updatedUser.coins;
  }
}

module.exports = CoinService;
