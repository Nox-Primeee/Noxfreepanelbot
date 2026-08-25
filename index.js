const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

// === SERVEUR HTTP ===
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
    res.send('🤖 NOX MINI BOT en ligne !');
});

app.listen(PORT, () => {
    console.log(`✅ Serveur HTTP sur le port ${PORT}`);
});

// === BOT TELEGRAM ===
const token = process.env.TELEGRAM_TOKEN;

if (!token) {
    console.error('❌ Token manquant !');
    process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

// === ADMIN ===
const ADMIN_ID = 8926614435; // ID Telegram de l'admin

// === MENUS ===

// Menu principal
const mainMenu = {
    reply_markup: {
        inline_keyboard: [
            [{ text: '📊 Gestion du Groupe', callback_data: 'group_menu' }],
            [{ text: '👤 Gestion des Membres', callback_data: 'members_menu' }],
            [{ text: '⚙️ Paramètres', callback_data: 'settings_menu' }],
            [{ text: '❓ Aide', callback_data: 'help' }]
        ]
    }
};

// Menu Groupe
const groupMenu = {
    reply_markup: {
        inline_keyboard: [
            [{ text: '🔇 Mute', callback_data: 'mute' }, { text: '🔊 Unmute', callback_data: 'unmute' }],
            [{ text: '🚫 Bannir', callback_data: 'ban' }, { text: '✅ Débannir', callback_data: 'unban' }],
            [{ text: '🔞 Nuke', callback_data: 'nuke' }],
            [{ text: '🔙 Retour', callback_data: 'back_main' }]
        ]
    }
};

// Menu Membres
const membersMenu = {
    reply_markup: {
        inline_keyboard: [
            [{ text: '📋 Liste des admins', callback_data: 'list_admins' }],
            [{ text: '📊 Statistiques', callback_data: 'stats' }],
            [{ text: '🔙 Retour', callback_data: 'back_main' }]
        ]
    }
};

// Menu Paramètres
const settingsMenu = {
    reply_markup: {
        inline_keyboard: [
            [{ text: '🔄 Changer le nom', callback_data: 'set_name' }],
            [{ text: '📝 Changer la description', callback_data: 'set_desc' }],
            [{ text: '🔙 Retour', callback_data: 'back_main' }]
        ]
    }
};

// === COMMANDES ===

// /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name || 'Utilisateur';

    bot.sendMessage(
        chatId,
        `👋 Bonjour ${firstName} !\n\nBienvenue sur **NOX MINI BOT** 🤖\n\nJe suis un bot de gestion de groupe puissant.\nChoisis une option ci-dessous :`,
        { ...mainMenu, parse_mode: 'Markdown' }
    );
});

// /menu (raccourci)
bot.onText(/\/menu/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(
        chatId,
        `📋 **Menu Principal**\n\nChoisis une option :`,
        { ...mainMenu, parse_mode: 'Markdown' }
    );
});

// === CALLBACKS (Boutons) ===

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    const data = query.data;
    const userId = query.from.id;

    // Vérifier si c'est l'admin pour certaines actions
    const isAdmin = userId === ADMIN_ID;

    // Répondre au callback pour enlever le chargement
    bot.answerCallbackQuery(query.id);

    // === MENU PRINCIPAL ===
    if (data === 'group_menu') {
        bot.editMessageText('📊 **Gestion du Groupe**\n\nQue veux-tu faire ?', {
            chat_id: chatId,
            message_id: messageId,
            ...groupMenu,
            parse_mode: 'Markdown'
        });
    }

    else if (data === 'members_menu') {
        bot.editMessageText('👤 **Gestion des Membres**\n\nQue veux-tu faire ?', {
            chat_id: chatId,
            message_id: messageId,
            ...membersMenu,
            parse_mode: 'Markdown'
        });
    }

    else if (data === 'settings_menu') {
        bot.editMessageText('⚙️ **Paramètres**\n\nQue veux-tu modifier ?', {
            chat_id: chatId,
            message_id: messageId,
            ...settingsMenu,
            parse_mode: 'Markdown'
        });
    }

    else if (data === 'help') {
        bot.editMessageText(
            `❓ **Aide**\n\n` +
            `📌 **Commandes :**\n` +
            `/start - Démarrer le bot\n` +
            `/menu - Afficher le menu\n` +
            `/ping - Vérifier si le bot est en ligne\n\n` +
            `🛠️ **Fonctionnalités :**\n` +
            `• Gestion des membres (mute, ban, etc.)\n` +
            `• Administration du groupe\n` +
            `• Statistiques\n\n` +
            `👑 **Admin :** @NoxPrimeee\n\n` +
            `🔙 Retourne au menu avec le bouton ci-dessous.`,
            {
                chat_id: chatId,
                message_id: messageId,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🔙 Retour au menu', callback_data: 'back_main' }]
                    ]
                },
                parse_mode: 'Markdown'
            }
        );
    }

    // === RETOUR ===
    else if (data === 'back_main') {
        bot.editMessageText('📋 **Menu Principal**\n\nChoisis une option :', {
            chat_id: chatId,
            message_id: messageId,
            ...mainMenu,
            parse_mode: 'Markdown'
        });
    }

    // === ACTIONS DU GROUPE ===
    else if (data === 'mute' && isAdmin) {
        bot.sendMessage(chatId, '🔇 Envoie le nom ou l\'ID de la personne à mute :\n(ou réponds à un message)');
        // Ici tu peux ajouter la logique de mute
    }

    else if (data === 'unmute' && isAdmin) {
        bot.sendMessage(chatId, '🔊 Envoie le nom ou l\'ID de la personne à unmute :');
    }

    else if (data === 'ban' && isAdmin) {
        bot.sendMessage(chatId, '🚫 Envoie le nom ou l\'ID de la personne à bannir :');
    }

    else if (data === 'unban' && isAdmin) {
        bot.sendMessage(chatId, '✅ Envoie le nom ou l\'ID de la personne à débannir :');
    }

    else if (data === 'nuke' && isAdmin) {
        bot.sendMessage(chatId, '⚠️ **NUKE** : Cette action va supprimer tous les messages !\nConfirme avec /confirm_nuke', { parse_mode: 'Markdown' });
    }

    // === ACTIONS MEMBRES ===
    else if (data === 'list_admins') {
        bot.getChatAdministrators(chatId).then(admins => {
            let adminList = '👑 **Liste des Admins :**\n\n';
            admins.forEach(admin => {
                const user = admin.user;
                adminList += `• ${user.first_name} ${user.last_name || ''} (${user.id})\n`;
            });
            bot.editMessageText(adminList, {
                chat_id: chatId,
                message_id: messageId,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🔙 Retour', callback_data: 'members_menu' }]
                    ]
                },
                parse_mode: 'Markdown'
            });
        }).catch(err => {
            bot.sendMessage(chatId, '❌ Impossible de récupérer la liste des admins.');
        });
    }

    else if (data === 'stats') {
        bot.getChat(chatId).then(chat => {
            const stats = `📊 **Statistiques du Groupe**\n\n` +
                `📝 Nom : ${chat.title}\n` +
                `👥 Membres : ${chat.participant_count || 'Inconnu'}\n` +
                `🆔 ID : ${chat.id}\n` +
                `📌 Type : ${chat.type}`;
            bot.editMessageText(stats, {
                chat_id: chatId,
                message_id: messageId,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🔙 Retour', callback_data: 'members_menu' }]
                    ]
                },
                parse_mode: 'Markdown'
            });
        }).catch(err => {
            bot.sendMessage(chatId, '❌ Impossible de récupérer les stats.');
        });
    }

    // === ACTIONS PARAMÈTRES ===
    else if (data === 'set_name' && isAdmin) {
        bot.sendMessage(chatId, '📝 Envoie le nouveau nom du groupe :');
    }

    else if (data === 'set_desc' && isAdmin) {
        bot.sendMessage(chatId, '📝 Envoie la nouvelle description du groupe :');
    }

    // === GESTION DES ERREURS ===
    else {
        bot.answerCallbackQuery(query.id, { text: '❌ Action non autorisée !' });
    }
});

// === COMMANDE /ping ===
bot.onText(/\/ping/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '🏓 Pong ! Le bot est en ligne.');
});

// === COMMANDE /confirm_nuke (admin uniquement) ===
bot.onText(/\/confirm_nuke/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    if (userId !== ADMIN_ID) {
        return bot.sendMessage(chatId, '❌ Seul l\'admin peut exécuter cette commande.');
    }

    // ICI : Logique de nuke (supprimer tous les messages)
    bot.sendMessage(chatId, '🧹 Nuke exécuté ! Tous les messages ont été supprimés.');
});

// === BIENVENUE ET DÉPART (optionnel) ===
bot.on('new_chat_members', (msg) => {
    const chatId = msg.chat.id;
    const newMember = msg.new_chat_members[0];
    bot.sendMessage(chatId, `👋 Bienvenue ${newMember.first_name} dans le groupe !`);
});

bot.on('left_chat_member', (msg) => {
    const chatId = msg.chat.id;
    const leftMember = msg.left_chat_member;
    bot.sendMessage(chatId, `👋 Au revoir ${leftMember.first_name} !`);
});

// === LOGS ===
console.log('🤖 NOX MINI BOT en ligne !');
console.log(`👑 Admin ID : ${ADMIN_ID}`);
