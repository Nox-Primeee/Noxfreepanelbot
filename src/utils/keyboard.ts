import { Markup } from 'telegraf';

export const mainKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('💰 Balance', 'balance',style:'primary'),
    Markup.button.callback('📊 My Servers', 'servers',style:'success')
  ],
  [
    Markup.button.callback('🆕 Create server', 'create',style:'danger'),
    Markup.button.callback('🔗 Referral', 'referral',style:'primary')
  ],
  [
    Markup.button.callback('❓ Help', 'help',style:'danger'),
    Markup.button.callback('👑 Admin', 'admin',style:'success')
  ]
]);

export const createServerKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('🖥️ Server Minecraft', 'create_minecraft',style:'primary'),
    Markup.button.callback('🌐 Server Web', 'create_web',style:'danger')
  ],
  [
    Markup.button.callback('Node Server', 'create_game',style:'success'),
    Markup.button.callback('📦 Other', 'create_other',stye:'primary')
  ],
  [Markup.button.callback('🔙 Back', 'back_main',style:'danger')]
]);

export const adminKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('👥 Users', 'admin_users',style:'primary'),
    Markup.button.callback('💰 Coins', 'admin_coins',style:'danger')
  ],
  [
    Markup.button.callback('📊 Statistics', 'admin_stats',style:'success'),
    Markup.button.callback('Dashboard', 'admin_settings',style:'primary')
  ],
  [Markup.button.callback('🔙 Back', 'back_main',style:'danger')]
]);

export const referralKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback('📤 Share', 'share_referral',style:'primary')],
  [Markup.button.callback('📊 My Referrals', 'my_referrals',style:'success')],
  [Markup.button.callback('🔙 Back', 'back_main',style:'danger')]
]);
