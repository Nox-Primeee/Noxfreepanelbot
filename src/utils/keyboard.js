const { Markup } = require('telegraf');

// === MAIN MENU ===
const mainKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('Balance', 'coins',style:'danger'),
    Markup.button.callback('Stats', 'stats',style:'primary')
  ],
  [
    Markup.button.callback(' Buy Server', 'buyserver',style:'success'),
    Markup.button.callback('Referral', 'referral',style:'danger')
  ],
  [
    Markup.button.callback('🎁 Daily', 'daily',style:'primary'),
    Markup.button.callback('Shop', 'shop',style:'success')
  ],
  [
    Markup.button.callback('My Servers', 'myservers',style:'danger'),
    Markup.button.callback('Profile', 'profile',style:'primary')
  ],
  [
    Markup.button.callback(' Leaderboard', 'leaderboard',style:'success'),
    Markup.button.callback('❓ Help', 'help',style:'danger')
  ],
  [
    Markup.button.callback(' Admin Panel', 'admin',style:'primary')
  ]
]);

// === SERVER MENU ===
const serverKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback(' Free Server', 'server_free',style:'success'),
    Markup.button.callback('Premium', 'server_premium',style:'danger')
  ],
  [
    Markup.button.callback(' VIP', 'server_vip',style:'primary'),
    Markup.button.callback('Owner', 'server_owner',style:'success')
  ],
  [
    Markup.button.callback(' My Servers', 'myservers',style:'danger'),
    Markup.button.callback('🔙 Back', 'back_main',style:'primary')
  ]
]);

// === ADMIN MENU ===
const adminKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('👥 Users', 'admin_users',style:'success'),
    Markup.button.callback('Servers', 'admin_servers',style:'danger')
  ],
  [
    Markup.button.callback('💰 Add Coins', 'admin_addcoins',style:'primary'),
    Markup.button.callback('🎁 Gift All', 'admin_giftall',style:'success')
  ],
  [
    Markup.button.callback('Create Redeem', 'admin_createredeem',style:'danger'),
    Markup.button.callback('Broadcast', 'admin_broadcast',style:'success')
  ],
  [
    Markup.button.callback('Free Servers', 'admin_freeservers',style:'primary'),
    Markup.button.callback('Stats', 'admin_stats',style:'danger')
  ],
  [
    Markup.button.callback('🔙 Back', 'back_main',style:'success')
  ]
]);

// === SHOP MENU ===
const shopKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('🪙 100 Coins - 1$', 'buy_100',style:'danger'),
    Markup.button.callback('🪙 500 Coins - 5$', 'buy_500',style:'primary')
  ],
  [
    Markup.button.callback('🪙 1000 Coins - 10$', 'buy_1000',style:'success'),
    Markup.button.callback('🪙 5000 Coins - 20$', 'buy_5000',style:'danger')
  ],
  [
    Markup.button.callback('Premium Plan', 'buy_premium',style:'primary'),
    Markup.button.callback('VIP Plan', 'buy_vip',style:'success')
  ],
  [
    Markup.button.callback('🔙 Back', 'back_main',style:'danger')
  ]
]);

// === REFERRAL MENU ===
const referralKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('📤 Share', 'share_referral',style:'primary'),
    Markup.button.callback('My Referrals', 'my_referrals',style:'success')
  ],
  [
    Markup.button.callback('🔙 Back', 'back_main',style:'danger')
  ]
]);

// === PROFILE MENU ===
const profileKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('Stats', 'stats',style:'primary'),
    Markup.button.callback('Upgrade', 'upgrade',style:'success')
  ],
  [
    Markup.button.callback('🔙 Back', 'back_main',style:'danger')
  ]
]);

module.exports = {
  mainKeyboard,
  serverKeyboard,
  adminKeyboard,
  shopKeyboard,
  referralKeyboard,
  profileKeyboard
};
