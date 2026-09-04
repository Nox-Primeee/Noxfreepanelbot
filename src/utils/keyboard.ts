// src/utils/keyboard.ts - Version ultra-simplifiée
import { Markup } from 'telegraf';

export const mainKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback('💰 Balance', 'balance')],
  [Markup.button.callback('🆕 Create Server', 'create')],
  [Markup.button.callback('🔗 Referral', 'referral')],
  [Markup.button.callback('❓ Help', 'help')]
]);

export const createServerKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback('Minecraft', 'create_minecraft')],
  [Markup.button.callback('Web', 'create_web')],
  [Markup.button.callback('Game', 'create_game')],
  [Markup.button.callback('🔙 Back', 'back_main')]
]);

export const adminKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback('Users', 'admin_users')],
  [Markup.button.callback('Coins', 'admin_coins')],
  [Markup.button.callback('🔙 Back', 'back_main')]
]);

export const referralKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback('Share', 'share_referral')],
  [Markup.button.callback('🔙 Back', 'back_main')]
]);
