const CoinService = require('../../services/coin/CoinService');
const ServerService = require('../../services/server/ServerService');
const { formatQuote, formatBold } = require('../../utils/formatter');
const { Markup } = require('telegraf');
const config = require('../../config');

const coinService = new CoinService();
const serverService = new ServerService();

// Définition des plans par RAM et durée
const PLANS = {
  free: [
    { ram: 500, duration: '24h', price: 20 },
    { ram: 1024, duration: '24h', price: 50 },
    { ram: 2048, duration: '24h', price: 100 },
    { ram: 4096, duration: '24h', price: 200 },
    { ram: 8192, duration: '24h', price: 400 }
  ],
  premium: [
    { ram: 1024, duration: '30d', price: 500 },
    { ram: 2048, duration: '30d', price: 800 },
    { ram: 4096, duration: '30d', price: 1200 },
    { ram: 8192, duration: '30d', price: 2000 }
  ],
  vip: [
    { ram: 1024, duration: '30d', price: 1000 },
    { ram: 2048, duration: '30d', price: 1500 },
    { ram: 4096, duration: '30d', price: 2500 },
    { ram: 8192, duration: '30d', price: 4000 }
  ],
  owner: [
    { ram: 8192, duration: 'unlimited', price: 0 },
    { ram: 16384, duration: 'unlimited', price: 0 }
  ]
};

async function buyserverCommand(ctx) {
  try {
    const user = await User.findOne({ telegramId: ctx.from.id });
    if (!user) {
      await ctx.reply(formatQuote('❌ Use /start to create your account.'));
      return;
    }

    const balance = await coinService.getBalance(ctx.from.id);
    const plan = user.plan || 'FREE';

    let message = `🆕 <b>Buy a Server</b>\n\n`;
    message += `💰 Your balance: ${balance} coins\n`;
    message += `📊 Your plan: ${plan}\n`;
    message += `🖥️ Servers: ${await Server.countDocuments({ userId: ctx.from.id })}/${config.PLANS[plan]?.servers || 1}\n\n`;
    message += `<b>Choose your RAM and duration:</b>`;

    // Créer des boutons dynamiques selon le plan
    const planKey = plan.toLowerCase();
    const available = PLANS[planKey] || PLANS.free;

    const buttons = available.map(p => 
      Markup.button.callback(
        `${p.ram}MB - ${p.duration} (${p.price} coins)`,
        `buy_${p.ram}_${p.duration}_${p.price}`
      )
    );

    // Regrouper par 2
    const keyboard = [];
    for (let i = 0; i < buttons.length; i += 2) {
      keyboard.push(buttons.slice(i, i + 2));
    }
    keyboard.push([Markup.button.callback('🔙 Back', 'back_main')]);

    await ctx.replyWithPhoto(
      { url: config.LOGO_URL },
      {
        caption: formatQuote(message),
        parse_mode: 'HTML',
        reply_markup: Markup.inlineKeyboard(keyboard)
      }
    );
  } catch (error) {
    await ctx.reply(formatQuote(`❌ Error: ${error.message}`));
  }
}

// Action callback pour acheter
bot.action(/buy_(\d+)_(\w+)_(\d+)/, async (ctx) => {
  const [_, ram, duration, price] = ctx.match;
  const userId = ctx.from.id;

  try {
    const balance = await coinService.getBalance(userId);
    if (balance < parseInt(price)) {
      await ctx.answerCbQuery('❌ Insufficient coins!');
      return;
    }

    // Créer le serveur
    const server = await serverService.createServer(
      userId,
      'free', // ou selon le plan
      parseInt(ram),
      duration,
      parseInt(price)
    );

    // Déduire les coins
    await coinService.spendCoins(userId, parseInt(price), `Server ${ram}MB ${duration}`);

    // Message de succès avec les identifiants
    let message = `✅ <b>Server created!</b>\n\n`;
    message += `🆔 ID: ${server.serverId}\n`;
    message += `📛 Name: ${server.name}\n`;
    message += `💾 RAM: ${server.ram}MB\n`;
    message += `⏰ Duration: ${server.duration}\n`;
    message += `💰 Price: ${server.price} coins\n`;
    message += `👤 Username: <code>${server.username}</code>\n`;
    message += `🔑 Password: <code>${server.password}</code>\n`;
    message += `🌐 Domain: ${server.domain}\n`;
    message += `📅 Expires: ${server.expiresAt.toLocaleDateString()}\n\n`;
    message += `💰 Remaining: ${await coinService.getBalance(userId)} coins`;

    // Boutons pour copier/coller et ouvrir
    const actionKeyboard = Markup.inlineKeyboard([
      [
        Markup.button.callback('📋 Copy Username', `copy_${server.username}`),
        Markup.button.callback('📋 Copy Password', `copy_${server.password}`)
      ],
      [
        Markup.button.url('🌐 Open Domain', server.domain),
        Markup.button.callback('📋 My Servers', 'myservers')
      ]
    ]);

    await ctx.replyWithPhoto(
      { url: config.LOGO_URL },
      {
        caption: formatQuote(message),
        parse_mode: 'HTML',
        ...actionKeyboard
      }
    );

    await ctx.answerCbQuery('✅ Server created!');
  } catch (error) {
    await ctx.reply(formatQuote(`❌ Error: ${error.message}`));
    await ctx.answerCbQuery('❌ Creation failed');
  }
});

module.exports = { buyserverCommand };
