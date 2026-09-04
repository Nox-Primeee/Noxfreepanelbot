import axios from 'axios';
import { config } from '../../config';

export class PterodactylService {
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    this.apiUrl = config.PTERODACTYL_URL;
    this.apiKey = config.PTERODACTYL_API_KEY;
  }

  private headers = {
    'Authorization': `Bearer ${this.apiKey}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  async createServer(userId: number, name: string, egg: string, memory: number) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/api/client/servers`,
        {
          name,
          user: userId.toString(),
          egg,
          memory,
          // ... autres paramètres
        },
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Pterodactyl API error: ${error}`);
    }
  }

  async getServer(id: string) {
    try {
      const response = await axios.get(
        `${this.apiUrl}/api/client/servers/${id}`,
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Pterodactyl API error: ${error}`);
    }
  }
}
