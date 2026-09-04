import { Markup } from 'telegraf';

export const mainKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('💰 Solde', 'balance'),
    Markup.button.callback('📊 Serveurs', 'servers')
  ],
  [
    Markup.button.callback('🆕 Créer', 'create'),
    Markup.button.callback('🔗 Parrainage', 'referral')
  ],
  [
    Markup.button.callback('❓ Aide', 'help'),
    Markup.button.callback('👑 Admin', 'admin')
  ]
]);

export const createServerKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('🖥️ Minecraft', 'create_minecraft'),
    Markup.button.callback('🌐 Web', 'create_web')
  ],
  [
    Markup.button.callback('🎮 Game', 'create_game'),
    Markup.button.callback('📦 Autre', 'create_other')
  ],
  [Markup.button.callback('🔙 Retour', 'back_main')]
]);

export const adminKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('👥 Utilisateurs', 'admin_users'),
    Markup.button.callback('💰 Coins', 'admin_coins')
  ],
  [
    Markup.button.callback('📊 Stats', 'admin_stats'),
    Markup.button.callback('⚙️ Paramètres', 'admin_settings')
  ],
  [Markup.button.callback('🔙 Retour', 'back_main')]
]);

export const referralKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback('📤 Partager', 'share_referral')],
  [Markup.button.callback('📊 Mes parrainages', 'my_referrals')],
  [Markup.button.callback('🔙 Retour', 'back_main')]
]);
