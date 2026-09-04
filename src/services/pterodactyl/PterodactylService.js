const axios = require('axios');
const config = require('../../config');

class PterodactylService {
  constructor() {
    this.apiUrl = config.PTERODACTYL_URL;
    this.apiKey = config.PTERODACTYL_API_KEY;
  }

  get headers() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
  }

  async createServer(userId, name, egg, memory) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/api/client/servers`,
        {
          name,
          user: userId.toString(),
          egg,
          memory
        },
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Pterodactyl API error: ${error.message}`);
    }
  }

  async getServer(id) {
    try {
      const response = await axios.get(
        `${this.apiUrl}/api/client/servers/${id}`,
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Pterodactyl API error: ${error.message}`);
    }
  }
}

module.exports = PterodactylService;
