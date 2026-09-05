// src/services/server/ServerService.js
const Server = require('../../database/models/Server');
const User = require('../../database/models/User');
const config = require('../../config');
const crypto = require('crypto');

class ServerService {
  constructor() {
    // Initialisation du service Pterodactyl si configuré
    this.pterodactylEnabled = !!(config.PTERODACTYL_URL && config.PTERODACTYL_API_KEY);
    if (this.pterodactylEnabled) {
      this.PterodactylService = require('../pterodactyl/PterodactylService');
      this.pteroService = new this.PterodactylService();
    }
  }

  /**
   * Génère un ID unique pour le serveur
   */
  generateServerId() {
    return crypto
      .createHash('md5')
      .update(`${Date.now()}-${Math.random()}-${process.pid}`)
      .digest('hex')
      .substring(0, 10)
      .toUpperCase();
  }

  /**
   * Génère des identifiants aléatoires
   */
  generateCredentials() {
    const username = 'nox_' + crypto.randomBytes(4).toString('hex').toLowerCase();
    const password = crypto.randomBytes(10).toString('base64').slice(0, 14);
    return { username, password };
  }

  /**
   * Crée un serveur avec toutes les informations
   */
  async createServer(userId, type, ram, duration, price, plan = 'FREE') {
    try {
      // Vérifier que l'utilisateur existe
      const user = await User.findOne({ telegramId: userId });
      if (!user) {
        throw new Error('User not found');
      }

      // Vérifier le nombre de serveurs max
      const maxServers = config.PLANS[plan]?.servers || 1;
      const currentServers = await Server.countDocuments({ userId, status: 'active' });
      if (currentServers >= maxServers) {
        throw new Error(`You have reached the maximum servers for your plan (${maxServers})`);
      }

      // Générer les identifiants
      const serverId = this.generateServerId();
      const { username, password } = this.generateCredentials();
      const domain = `${serverId.toLowerCase()}.${config.DOMAIN_BASE || 'noxpanel.com'}`;

      // Calculer la date d'expiration
      const expiresAt = this.calculateExpiry(duration);

      // Créer le serveur en base
      const server = new Server({
        userId,
        serverId,
        name: `${type}-${Date.now().toString().slice(-6)}`,
        type,
        ram: parseInt(ram),
        duration,
        price: parseInt(price),
        plan: plan,
        username,
        password,
        domain,
        expiresAt,
        status: 'active'
      });

      await server.save();

      // Si Pterodactyl est activé, créer le serveur sur le panel
      if (this.pterodactylEnabled && this.pteroService) {
        try {
          const pteroResult = await this.pteroService.createServer(
            userId,
            server.name,
            type,
            ram,
            username,
            password
          );
          server.pterodactylId = pteroResult.id;
          await server.save();
        } catch (pteroError) {
          console.warn('⚠️ Pterodactyl creation failed:', pteroError.message);
          // Le serveur existe déjà en base, on ne supprime pas
        }
      }

      return server;
    } catch (error) {
      throw new Error(`Failed to create server: ${error.message}`);
    }
  }

  /**
   * Calcule la date d'expiration selon la durée
   */
  calculateExpiry(duration) {
    const now = new Date();
    switch (duration) {
      case '24h':
        now.setHours(now.getHours() + 24);
        break;
      case '7d':
        now.setDate(now.getDate() + 7);
        break;
      case '30d':
        now.setDate(now.getDate() + 30);
        break;
      case 'unlimited':
        now.setFullYear(now.getFullYear() + 100);
        break;
      default:
        now.setDate(now.getDate() + 1); // 1 jour par défaut
    }
    return now;
  }

  /**
   * Récupère un serveur par son ID
   */
  async getServer(serverId) {
    const server = await Server.findOne({ serverId });
    if (!server) {
      throw new Error('Server not found');
    }
    return server;
  }

  /**
   * Récupère tous les serveurs d'un utilisateur
   */
  async getUserServers(userId, status = null) {
    const query = { userId };
    if (status) query.status = status;
    return await Server.find(query).sort({ createdAt: -1 });
  }

  /**
   * Récupère tous les serveurs (admin)
   */
  async getAllServers(limit = 50) {
    return await Server.find().sort({ createdAt: -1 }).limit(limit);
  }

  /**
   * Met à jour le statut d'un serveur
   */
  async updateServerStatus(serverId, status) {
    const server = await Server.findOne({ serverId });
    if (!server) {
      throw new Error('Server not found');
    }
    server.status = status;
    await server.save();
    return server;
  }

  /**
   * Supprime un serveur
   */
  async deleteServer(serverId) {
    const server = await Server.findOneAndDelete({ serverId });
    if (!server) {
      throw new Error('Server not found');
    }
    return server;
  }

  /**
   * Supprime tous les serveurs d'un utilisateur
   */
  async deleteUserServers(userId) {
    return await Server.deleteMany({ userId });
  }

  /**
   * Vérifie si un utilisateur peut créer un serveur
   */
  async canCreateServer(userId) {
    const user = await User.findOne({ telegramId: userId });
    if (!user) {
      return { allowed: false, reason: 'User not found' };
    }

    const plan = user.plan || 'FREE';
    const maxServers = config.PLANS[plan]?.servers || 1;
    const currentServers = await Server.countDocuments({ userId, status: 'active' });

    if (currentServers >= maxServers) {
      return {
        allowed: false,
        reason: `You have reached the maximum servers for your plan (${maxServers})`,
        maxServers,
        currentServers
      };
    }

    return {
      allowed: true,
      maxServers,
      currentServers,
      plan
    };
  }

  /**
   * Renouvelle un serveur
   */
  async renewServer(serverId, days = 30) {
    const server = await Server.findOne({ serverId });
    if (!server) {
      throw new Error('Server not found');
    }

    const newExpiry = new Date(server.expiresAt || Date.now());
    newExpiry.setDate(newExpiry.getDate() + days);
    server.expiresAt = newExpiry;
    server.status = 'active';
    await server.save();

    return server;
  }

  /**
   * Vérifie et suspend les serveurs expirés
   */
  async checkExpiredServers() {
    const now = new Date();
    const expired = await Server.find({
      expiresAt: { $lt: now },
      status: 'active'
    });

    const results = [];
    for (const server of expired) {
      server.status = 'suspended';
      await server.save();
      results.push(server.serverId);
    }

    return {
      count: results.length,
      servers: results
    };
  }

  /**
   * Statistiques des serveurs
   */
  async getServerStats() {
    const total = await Server.countDocuments();
    const active = await Server.countDocuments({ status: 'active' });
    const suspended = await Server.countDocuments({ status: 'suspended' });
    const inactive = await Server.countDocuments({ status: 'inactive' });

    const byType = await Server.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    const byPlan = await Server.aggregate([
      { $group: { _id: '$plan', count: { $sum: 1 } } }
    ]);

    const byRam = await Server.aggregate([
      { $group: { _id: '$ram', count: { $sum: 1 } } }
    ]);

    return {
      total,
      active,
      suspended,
      inactive,
      byType,
      byPlan,
      byRam
    };
  }

  /**
   * Renvoie les détails d'un serveur formatés pour l'affichage
   */
  formatServerInfo(server) {
    return {
      id: server.serverId,
      name: server.name,
      type: server.type,
      ram: server.ram,
      duration: server.duration,
      plan: server.plan,
      username: server.username,
      password: server.password,
      domain: server.domain,
      status: server.status,
      expiresAt: server.expiresAt.toLocaleDateString(),
      createdAt: server.createdAt.toLocaleDateString()
    };
  }

  /**
   * Vérifie la validité d'une durée
   */
  isValidDuration(duration) {
    return ['24h', '7d', '30d', 'unlimited'].includes(duration);
  }

  /**
   * Obtient le prix d'un serveur selon RAM et durée
   */
  getServerPrice(ram, duration) {
    // Logique de prix personnalisable
    const priceMap = {
      '24h': { 500: 20, 1024: 50, 2048: 100, 4096: 200, 8192: 400 },
      '7d': { 500: 100, 1024: 200, 2048: 400, 4096: 800, 8192: 1600 },
      '30d': { 500: 300, 1024: 500, 2048: 800, 4096: 1200, 8192: 2000 },
      'unlimited': { 8192: 0, 16384: 0 }
    };
    return priceMap[duration]?.[ram] || 0;
  }
}

module.exports = ServerService;
