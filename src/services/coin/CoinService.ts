import User, { IUser } from '../../database/models/User';
import Transaction from '../../database/models/Transaction';
import { config } from '../../config';

export class CoinService {
  async getBalance(telegramId: number): Promise<number> {
    const user = await User.findOne({ telegramId });
    return user?.coins || 0;
  }

  async addCoins(telegramId: number, amount: number, description: string, type: 'earn' | 'referral' = 'earn') {
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

  async spendCoins(telegramId: number, amount: number, description: string) {
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

    return updatedUser!.coins;
  }
}
