const Server = require('../../database/models/Server');
const config = require('../../config');
const crypto = require('crypto');

class ServerService {
  constructor() {
    // Vous pouvez initialiser ici le PterodactylService si nécessaire
    // this.pteroService = new PterodactylService();
  }

  /**
   * Génère un ID unique pour le serveur
   */
  generateServerId() {
    return crypto
      .createHash('md5')
      .update(`${Date.now()}-${Math.random()}`)
      .digest('hex')
      .substring(0, 10)
      .toUpperCase();
  }

  /**
   * Crée un nouveau serveur pour un utilisateur
   */
  async createServer(userId, type, plan = null) {
    try {
      // Si aucun plan n'est fourni, utiliser le plan par défaut
      if (!plan) {
        plan = config.PLANS[type.toUpperCase()] || config.PLANS.FREE;
      }

      const serverId = this.generateServerId();
      const serverName = `${type}-${Date.now().toString().slice(-6)}`;

      // Calculer la date d'expiration (30 jours par défaut)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      // Créer le serveur dans la base de données
      const server = new Server({
        userId: userId,
        serverId: serverId,
        name: serverName,
        type: type.toLowerCase(),
        status: 'active',
        plan: plan.name || 'Free',
        memory: plan.memory || 1024,
        expiresAt: expiresAt
      });

      await server.save();

      // Ici, vous pouvez appeler l'API Pterodactyl pour créer le serveur réel
      // const pteroResult = await this.pteroService.createServer(
      //   userId,
      //   serverName,
      //   type,
      //   plan.memory || 1024
      // );

      // Si vous utilisez Pterodactyl, vous pouvez stocker des infos supplémentaires
      // server.pterodactylId = pteroResult.id;
      // await server.save();

      return server;
    } catch (error) {
      throw new Error(`Failed to create server: ${error.message}`);
    }
  }

  /**
   * Récupère un serveur par son ID
   */
  async getServer(serverId) {
    try {
      const server = await Server.findOne({ serverId });
      if (!server) {
        throw new Error('Server not found');
      }
      return server;
    } catch (error) {
      throw new Error(`Failed to get server: ${error.message}`);
    }
  }

  /**
   * Récupère tous les serveurs d'un utilisateur
   */
  async getUserServers(userId) {
    try {
      const servers = await Server.find({ userId }).sort({ createdAt: -1 });
      return servers;
    } catch (error) {
      throw new Error(`Failed to get user servers: ${error.message}`);
    }
  }

  /**
   * Récupère tous les serveurs (admin)
   */
  async getAllServers() {
    try {
      const servers = await Server.find().sort({ createdAt: -1 });
      return servers;
    } catch (error) {
      throw new Error(`Failed to get all servers: ${error.message}`);
    }
  }

  /**
   * Met à jour le statut d'un serveur
   */
  async updateServerStatus(serverId, status) {
    try {
      const server = await Server.findOne({ serverId });
      if (!server) {
        throw new Error('Server not found');
      }

      server.status = status;
      await server.save();
      return server;
    } catch (error) {
      throw new Error(`Failed to update server status: ${error.message}`);
    }
  }

  /**
   * Supprime un serveur
   */
  async deleteServer(serverId) {
    try {
      const server = await Server.findOneAndDelete({ serverId });
      if (!server) {
        throw new Error('Server not found');
      }
      return server;
    } catch (error) {
      throw new Error(`Failed to delete server: ${error.message}`);
    }
  }

  /**
   * Supprime tous les serveurs d'un utilisateur
   */
  async deleteUserServers(userId) {
    try {
      const result = await Server.deleteMany({ userId });
      return result;
    } catch (error) {
      throw new Error(`Failed to delete user servers: ${error.message}`);
    }
  }

  /**
   * Vérifie si un utilisateur peut créer un nouveau serveur
   */
  async canCreateServer(userId) {
    try {
      const userServers = await Server.countDocuments({ userId });
      const user = await require('../../database/models/User').findOne({ telegramId: userId });
      
      if (!user) {
        return { allowed: false, reason: 'User not found' };
      }

      const plan = user.plan || 'FREE';
      const maxServers = config.PLANS[plan.toUpperCase()]?.servers || 1;

      if (userServers >= maxServers) {
        return { 
          allowed: false, 
          reason: `You have reached the maximum servers for your plan (${maxServers})` 
        };
      }

      return { allowed: true, maxServers, currentServers: userServers };
    } catch (error) {
      throw new Error(`Failed to check server creation: ${error.message}`);
    }
  }

  /**
   * Récupère les statistiques des serveurs
   */
  async getServerStats() {
    try {
      const total = await Server.countDocuments();
      const active = await Server.countDocuments({ status: 'active' });
      const inactive = await Server.countDocuments({ status: 'inactive' });
      const suspended = await Server.countDocuments({ status: 'suspended' });

      const byType = await Server.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ]);

      const byPlan = await Server.aggregate([
        { $group: { _id: '$plan', count: { $sum: 1 } } }
      ]);

      return {
        total,
        active,
        inactive,
        suspended,
        byType,
        byPlan
      };
    } catch (error) {
      throw new Error(`Failed to get server stats: ${error.message}`);
    }
  }

  /**
   * Renouvelle un serveur (prolonge l'expiration)
   */
  async renewServer(serverId, days = 30) {
    try {
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
    } catch (error) {
      throw new Error(`Failed to renew server: ${error.message}`);
    }
  }

  /**
   * Vérifie les serveurs expirés et les suspend
   */
  async checkExpiredServers() {
    try {
      const now = new Date();
      const expired = await Server.find({ 
        expiresAt: { $lt: now },
        status: 'active'
      });

      for (const server of expired) {
        server.status = 'suspended';
        await server.save();
      }

      return expired.length;
    } catch (error) {
      throw new Error(`Failed to check expired servers: ${error.message}`);
    }
  }
}

module.exports = ServerService;
