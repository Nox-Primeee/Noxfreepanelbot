🤖 NOX FREEPANEL BOT SCRIPT OPEN SOURCE 

<div align="center">
  <img src="https://files.catbox.moe/cqk5ac.jpg" alt="NOX FREEPANEL BOT" width="200" height="200">

NOX FREEPANEL BOT

https://img.shields.io/badge/Telegram-Bot-blue?style=for-the-badge&logo=telegram
https://img.shields.io/badge/Version-1.0.0-green?style=for-the-badge
https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge
https://img.shields.io/badge/Node.js-18.x-green?style=for-the-badge&logo=node.js
https://img.shields.io/badge/MongoDB-8.0-brightgreen?style=for-the-badge&logo=mongodb
https://img.shields.io/badge/Pterodactyl-Compatible-orange?style=for-the-badge&logo=pterodactyl
https://img.shields.io/badge/Render-Deploy-success?style=for-the-badge&logo=render

  <p align="center">
    <b>🚀 The Ultimate Open Source Telegram Bot for Pterodactyl Panel Management</b><br>
    <i>with Coin System, Referral Program, Server Plans, and Advanced Admin Panel</i>
  </p>
</div>

---

📊 Repository Statistics

<div align="center">

Metric Count
⭐ Stars https://img.shields.io/github/stars/nox-primeee/NoxFreepanelBot?style=social
🍴 Forks https://img.shields.io/github/forks/nox-primeee/NoxFreepanelBot?style=social
👁️ Watchers https://img.shields.io/github/watchers/nox-primeee/NoxFreepanelBot?style=social
📁 Repository Size https://img.shields.io/github/repo-size/nox-primeee/NoxFreepanelBot
🕒 Last Commit https://img.shields.io/github/last-commit/nox-primeee/NoxFreepanelBot
👥 Contributors https://img.shields.io/github/contributors/nox-primeee/NoxFreepanelBot
📝 Open Issues https://img.shields.io/github/issues/nox-primeee/NoxFreepanelBot
📦 Pull Requests https://img.shields.io/github/issues-pr/nox-primeee/NoxFreepanelBot
🚦 CI/CD Status https://img.shields.io/github/actions/workflow/status/nox-primeee/NoxFreepanelBot/ci.yml?branch=main

</div>

---

👥 Repository Visitors

<div align="center">
  <img src="https://profile-counter.glitch.me/nox-primeee/count.svg" alt="Visitor Count">
</div>

---

#📋 Table of Contents

· 🌟 Features
· 🖼️ Screenshots
· 🚀 Quick Start
· 📦 Installation
· ⚙️ Configuration
· 📝 User Commands
· 👑 Admin Commands
· 💰 Coin System
· 🔗 Referral System
· 🖥️ Server Plans
· 📁 Project Structure
· 🚀 Deployment
· 🤝 Contributing
· 📄 License
· 📞 Support

---

🌟 Features

🤖 Core Features

· ✅ User Management with MongoDB database
· ✅ Coin System with transactions history
· ✅ Referral Program with bonus rewards
· ✅ Pterodactyl Server Management (optional)
· ✅ Inline Keyboard for easy navigation
· ✅ Rich Formatting with HTML parsing
· ✅ Quote Styling for every message
· ✅ Custom Logo displayed with each command
· ✅ Channel Verification before using the bot
· ✅ Multiple Server Plans (Free, Premium, VIP, Owner)

🎯 Server Plans

Plan Max Servers RAM Options Duration Price Range
Free 1 500MB - 8GB 24h 20 - 400 coins
Premium 3 1GB - 8GB 30 days 500 - 2000 coins
VIP 5 1GB - 8GB 30 days 1000 - 4000 coins
Owner Unlimited 8GB - 16GB Unlimited 0 coins (Admin only)

🔐 Security Features

· 🛡️ Channel Verification - Users must join required channels
· 🔑 Referral Requirement - Minimum 5 referrals to create servers
· 📝 Activity Logging with Winston
· 🛑 Error Handling with graceful recovery
· 👑 Admin Panel with full control


🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/nox-primeee/NoxFreepanelBot.git

# Navigate to project directory
cd NoxFreepanelBot

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Start the bot
npm start
```

---

📦 Installation

Prerequisites

· Node.js 18.x or higher
· MongoDB 6.x or higher
· Pterodactyl Panel (optional, for server creation)
· Telegram Bot Token (from @BotFather)

Step-by-Step Guide

1. Clone the Repository

```bash
git clone https://github.com/nox-primeee/NoxFreepanelBot.git
cd NoxFreepanelBot
```

2. Install Dependencies

```bash
npm install
```

3. Configure Environment

```bash
cp .env.example .env
nano .env
```

4. Start the Bot

```bash
npm start
```

---

⚙️ Configuration

Environment Variables (.env)

Variable Description Required
BOT_TOKEN Telegram Bot Token ✅ Yes
ADMIN_ID Telegram ID of the admin ✅ Yes
MONGODB_URI MongoDB connection URI ✅ Yes
PTERODACTYL_URL Pterodactyl Panel URL ❌ No
PTERODACTYL_API_KEY Pterodactyl API Key ❌ No
STARTING_COINS Initial coins for new users ✅ Yes
COINS_PER_REFERRAL Coins earned per referral ✅ Yes
DAILY_COINS Coins earned daily ✅ Yes
SERVER_COST Base server cost ✅ Yes
REFERRALS_REQUIRED Referrals needed to create servers ✅ Yes
REQUIRED_CHANNELS Channel IDs to join (comma separated) ✅ Yes
DOMAIN_BASE Base domain for server URLs ❌ No

Example .env File

```env
# Telegram
BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
ADMIN_ID=8926614435

# Database
MONGODB_URI=mongodb://localhost:27017/bot_db

# Pterodactyl (optional)
PTERODACTYL_URL=https://panel.yourdomain.com
PTERODACTYL_API_KEY=ptlc_xxxxxxxxxxxx

# Coin System
STARTING_COINS=100
COINS_PER_REFERRAL=50
DAILY_COINS=5
SERVER_COST=200
REFERRALS_REQUIRED=5

# Channels
REQUIRED_CHANNELS=-1001234567890,-1009876543210

# Domain
DOMAIN_BASE=noxpanel.com
```

---

📝 User Commands

Basic Commands

Command Description Example
/menu Show main menu /menu
/coins Check your balance /coins
/daily Claim daily coins /daily
/referral View referral info /referral
/stats View your statistics /stats
/profile View your profile /profile
/help Show help menu /help
/myid Show your Telegram ID /myid
/verify Verify channel membership /verify

Server Commands

Command Description Example
/buyserver Buy a server /buyserver
/myservers View your servers /myservers
/shop View shop /shop
/redeem <code> Redeem a code /redeem NOX5XDX5091
/upgrade Upgrade your plan /upgrade
/purchase Purchase coins /purchase
/leaderboard View top users /leaderboard

---

👑 Admin Commands

Admin Panel

Command Description Example
/admin Open admin panel /admin
/adminstats View advanced statistics /adminstats

User Management

Command Description Example
/listusers List recent users /listusers
/userinfo <id> View user details /userinfo 123456789
/deluser <id> Delete a user /deluser 123456789
/setplan <id> <plan> Set user plan /setplan 123456789 VIP

Server Management

Command Description Example
/listservers List all servers /listservers
/delserver <id> Delete a server /delserver ABC1234567
/freeservers <ram> <duration> Create free servers for all /freeservers 1024 24h
/checkexpired Check and suspend expired servers /checkexpired

Coin Management

Command Description Example
/addcoins <id> <amount> Add coins to user /addcoins 123456789 100
/giftall <amount> Gift coins to all users /giftall 10
/createredeem <reward> <max> Create redeem code /createredeem 10 5

Communication

Command Description Example
/broadcast <message> Send announcement to all /broadcast New update!

---

💰 Coin System

How to Earn Coins

Activity Coins Earned
🎁 Welcome Bonus 100 coins
📅 Daily Bonus 5 coins per day
👥 Referral Bonus 50 coins per referral
🎊 Special Events Varies

How to Spend Coins

Activity Coin Cost
🖥️ Server (500MB - 24h) 20 coins
🖥️ Server (1GB - 24h) 50 coins
🖥️ Server (2GB - 24h) 100 coins
🖥️ Server (4GB - 24h) 200 coins
🖥️ Server (8GB - 24h) 400 coins
💎 Premium Plan 500+ coins
👑 VIP Plan 1000+ coins

---

🔗 Referral System

How It Works

1. Generate Your Code: Use /referral to get your unique code
2. Share Your Link: Send https://t.me/your_bot_username?start=CODE
3. Earn Coins: Get 50 coins for each referral
4. Unlock Servers: Reach 5 referrals to create servers

Referral Benefits

User Benefit
👤 Referrer 50 coins per referral
🆕 Referred User 100 welcome coins
🏆 Top Referrers Bonus rewards

---

🖥️ Server Plans

Plan Overview

Plan Max Servers RAM Options Duration Price Range
Free 1 500MB - 8GB 24h 20 - 400 coins
Premium 3 1GB - 8GB 30 days 500 - 2000 coins
VIP 5 1GB - 8GB 30 days 1000 - 4000 coins
Owner Unlimited 8GB - 16GB Unlimited 0 coins

Server Features

· ✅ Auto-generated Credentials - Username & password
· ✅ Custom Domain - serverid.yourdomain.com
· ✅ Expiration Management - Auto-suspend after expiry
· ✅ Copy Credentials - One-click copy buttons
· ✅ Status Tracking - Active, Suspended, Inactive

---

📁 Project Structure

```
NoxFreepanelBot/
├── src/
│   ├── config/
│   │   └── index.js
│   ├── database/
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Transaction.js
│   │   │   ├── Server.js
│   │   │   └── RedeemCode.js
│   │   └── index.js
│   ├── services/
│   │   ├── coin/
│   │   │   └── CoinService.js
│   │   ├── referral/
│   │   │   └── ReferralService.js
│   │   ├── server/
│   │   │   └── ServerService.js
│   │   └── pterodactyl/
│   │       └── PterodactylService.js
│   ├── handlers/
│   │   ├── commands/
│   │   │   ├── menu.js
│   │   │   ├── coins.js
│   │   │   ├── daily.js
│   │   │   ├── referral.js
│   │   │   ├── stats.js
│   │   │   ├── help.js
│   │   │   ├── myid.js
│   │   │   ├── buyserver.js
│   │   │   ├── myservers.js
│   │   │   ├── purchase.js
│   │   │   ├── upgrade.js
│   │   │   ├── profile.js
│   │   │   ├── leaderboard.js
│   │   │   ├── redeem.js
│   │   │   ├── shop.js
│   │   │   ├── verify.js
│   │   │   └── admin.js
│   │   └── messages/
│   │       └── index.js
│   ├── middleware/
│   │   └── checkChannel.js
│   ├── utils/
│   │   ├── formatter.js
│   │   ├── keyboard.js
│   │   └── logger.js
│   └── bot.js
├── .env.example
├── .gitignore
├── package.json
├── Dockerfile
├── render.yaml
└── README.md
```

---

🚀 Deployment

🖥️ Deploy on Pterodactyl (Node.js Server)

This bot is designed to run on any Node.js server, including those created via Pterodactyl.

1. Create a Node.js server on your Pterodactyl panel (version 18 or 20).
2. Set environment variables in the server's startup settings (as shown in the Configuration section).
3. Clone the repository in the server's directory:
   ```bash
   git clone https://github.com/nox-primeee/NoxFreepanelBot.git .
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the bot with the command:
   ```bash
   npm start
   ```
6. Enable auto-restart in the Pterodactyl server settings.

---

☁️ Deploy on Render.com (Recommended)

1. Go to render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: nox-primeee/NoxFreepanelBot
4. Use these settings:
   · Environment: Node
   · Build Command: npm install
   · Start Command: npm start
5. Add all environment variables from .env
6. Click "Deploy"

---

⚡ Deploy on Heroku

1. Install Heroku CLI and login:
   ```bash
   heroku login
   ```
2. Create a new app:
   ```bash
   heroku create nox-freepanel-bot
   ```
3. Set environment variables:
   ```bash
   heroku config:set BOT_TOKEN=xxx ADMIN_ID=xxx MONGODB_URI=xxx
   ```
4. Deploy:
   ```bash
   git push heroku main
   ```
5. Start the worker:
   ```bash
   heroku ps:scale worker=1
   ```

---

🐳 Deploy with Docker

```bash
# Build the image
docker build -t nox-freepanel-bot .

# Run the container
docker run -d --name nox-bot \
  -e BOT_TOKEN=xxx \
  -e ADMIN_ID=xxx \
  -e MONGODB_URI=xxx \
  -p 3000:3000 \
  nox-freepanel-bot
```

---

🖥️ Deploy on a VPS (DigitalOcean, AWS, etc.)

1. Install Node.js and MongoDB:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs mongodb
   ```
2. Clone the repository:
   ```bash
   git clone https://github.com/nox-primeee/NoxFreepanelBot.git
   cd NoxFreepanelBot
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure .env:
   ```bash
   cp .env.example .env
   nano .env
   ```
5. Start with PM2 (for auto-restart):
   ```bash
   npm install -g pm2
   pm2 start src/bot.js --name nox-bot
   pm2 save
   pm2 startup
   ```

---

🚀 Deploy on Railway.app

1. Go to railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select nox-primeee/NoxFreepanelBot
4. Add environment variables
5. Click "Deploy"

---

📦 Deploy on Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. Deploy:
   ```bash
   vercel
   ```
3. Set environment variables in the Vercel dashboard

---

🤝 Contributing

How to Contribute

1. Fork the Repository
   ```bash
   git fork https://github.com/nox-primeee/NoxFreepanelBot.git
   ```
2. Create Feature Branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit Changes
   ```bash
   git commit -m "Add amazing feature"
   ```
4. Push to Branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. Create Pull Request
   · Open a Pull Request on GitHub
   · Describe your changes
   · Wait for review

Guidelines

· Follow JavaScript/Node.js best practices
· Write clear commit messages
· Update documentation
· Test your changes before submitting
· Ensure code passes ESLint checks

---

📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

```
MIT License

Copyright (c) 2026 Nox-Primeee

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

📞 Support

Contact Information

Platform Link Username
Telegram @NoxFreepanelBot @NoxFreepanelBot
Telegram Support @Nox-primeee @Nox-primeee
GitHub nox-primeee nox-primeee
Discord Join Server Nox#0001

Support Features

· 🐛 Bug Reports: Open an issue on GitHub
· 💡 Feature Requests: Submit via Discord
· 📚 Documentation: Check the Wiki
· ❓ Questions: Join our Telegram group
· 🚨 Emergency: Contact @Nox-primeee directly

---

🌟 Show Your Support

If you find this project useful, please give it a ⭐️ on GitHub!

<div align="center">

https://img.shields.io/github/stars/nox-primeee/NoxFreepanelBot?style=social
https://img.shields.io/github/forks/nox-primeee/NoxFreepanelBot?style=social

</div>

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/nox-primeee">Nox-Primeee</a></sub>
  <br>
  <sub>⭐ 0 | 🍴 0 | 👁️ 0</sub>
</div>
```
