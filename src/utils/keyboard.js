const { Markup } = require('telegraf');

// === MAIN MENU ===
const mainKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('Balance', 'coins'),
    Markup.button.callback('Stats', 'stats')
  ],
  [
    Markup.button.callback(' Buy Server', 'buyserver'),
    Markup.button.callback('Referral', 'referral')
  ],
  [
    Markup.button.callback('🎁 Daily', 'daily'),
    Markup.button.callback('Shop', 'shop')
  ],
  [
    Markup.button.callback('My Servers', 'myservers'),
    Markup.button.callback('Profile', 'profile')
  ],
  [
    Markup.button.callback(' Leaderboard', 'leaderboard'),
    Markup.button.callback('❓ Help', 'help')
  ],
  [
    Markup.button.callback(' Admin Panel', 'admin')
  ]
]);

// === SERVER MENU ===
const serverKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback(' Free Server', 'server_free'),
    Markup.button.callback('Premium', 'server_premium')
  ],
  [
    Markup.button.callback(' VIP', 'server_vip'),
    Markup.button.callback('Owner', 'server_owner')
  ],
  [
    Markup.button.callback(' My Servers', 'myservers'),
    Markup.button.callback('🔙 Back', 'back_main',style:)
  ]
]);

// === ADMIN MENU ===
const adminKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('👥 Users', 'admin_users'),
    Markup.button.callback('Servers', 'admin_servers')
  ],
  [
    Markup.button.callback('💰 Add Coins', 'admin_addcoins'),
    Markup.button.callback('🎁 Gift All', 'admin_giftall')
  ],
  [
    Markup.button.callback('Create Redeem', 'admin_createredeem'),
    Markup.button.callback('Broadcast', 'admin_broadcast')
  ],
  [
    Markup.button.callback('Free Servers', 'admin_freeservers'),
    Markup.button.callback('Stats', 'admin_stats')
  ],
  [
    Markup.button.callback('🔙 Back', 'back_main')
  ]
]);

// === SHOP MENU ===
const shopKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('🪙 100 Coins - 1$', 'buy_100'),
    Markup.button.callback('🪙 500 Coins - 5$', 'buy_500')
  ],
  [
    Markup.button.callback('🪙 1000 Coins - 10$', 'buy_1000'),
    Markup.button.callback('🪙 5000 Coins - 20$', 'buy_5000')
  ],
  [
    Markup.button.callback('Premium Plan', 'buy_premium'),
    Markup.button.callback('VIP Plan', 'buy_vip')
  ],
  [
    Markup.button.callback('🔙 Back', 'back_main')
  ]
]);

// === REFERRAL MENU ===
const referralKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('📤 Share', 'share_referral'),
    Markup.button.callback('My Referrals', 'my_referrals')
  ],
  [
    Markup.button.callback('🔙 Back', 'back_main')
  ]
]);

// === PROFILE MENU ===
const profileKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('Stats', 'stats'),
    Markup.button.callback('Upgrade', 'upgrade')
  ],
  [
    Markup.button.callback('🔙 Back', 'back_main')
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
