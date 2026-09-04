<a href="[${config.LOGO_URL}](https://files.catbox.moe/cqk5ac.jpg)">
  
# Telegram Free Panel bot Script Open source Made by @Nox-primeee 

# Pterodactyl Telegram Bot

Un bot Telegram pour gérer un panel Pterodactyl avec système de coins et parrainage.

## Fonctionnalités

- 👤 Système d'utilisateurs avec base de données MongoDB
- 💰 Système de coins pour les serveurs
- 🔗 Système de parrainage avec récompenses
- 🖥️ Gestion de serveurs Pterodactyl
- 📊 Dashboard des statistiques

## Installation

1. Clonez le repository
2. Installez les dépendances : `npm install`
3. Configurez le fichier `.env`
4. Lancez le bot : `npm run dev`

## Commandes

- `/start` - Démarrer le bot
- `/balance` - Voir son solde
- `/referral` - Obtenir son code de parrainage
- `/create` - Créer un serveur
- `/help` - Aide

## Technologies

- Node.js / TypeScript
- Telegraf
- MongoDB / Mongoose
- Pterodactyl API

# Initialiser votre repository
```
git init
git add .
git commit -m "Initial commit with bot structure"
git remote add origin https://github.com/Nox-Primeee/TeleGram-Bot.git
git branch -M main
git push -u origin main```



## 🔑 Variables d'environnement

**.env**
```env
# Telegram
BOT_TOKEN=your_bot_token_here

# Pterodactyl
PTERODACTYL_URL=https://your-panel.com
PTERODACTYL_API_KEY=your_api_key_here

# Database
MONGODB_URI=mongodb://localhost:27017/bot_db

# Coins settings
STARTING_COINS=100
COINS_PER_REFERRAL=50
COINS_PER_SERVER=10
SERVER_COST=200
