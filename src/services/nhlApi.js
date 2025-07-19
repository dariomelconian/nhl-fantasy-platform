import axios from 'axios';
import API_CONFIG from '../config/api';
import { NHL_TEAMS } from '../utils/constants';

class NHLApiService {
  constructor() {
    this.baseURL = API_CONFIG.NHL.BASE_URL;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    this.client.interceptors.response.use(
      response => response,
      error => {
        console.error('NHL API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  async getTeams() {
    try {
      const response = await this.client.get('/teams');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch teams: ${error.message}`);
    }
  }

  async getStandings() {
    try {
      const response = await this.client.get('/standings/now');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch standings: ${error.message}`);
    }
  }

  async getPlayerStats(playerId) {
    try {
      const response = await this.client.get(`/player/${playerId}/landing`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch player stats for ${playerId}: ${error.message}`);
    }
  }

  async getTeamRoster(teamAbbrev) {
    try {
      const response = await this.client.get(`/roster/${teamAbbrev}/current`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch roster for ${teamAbbrev}: ${error.message}`);
    }
  }

  async getTeamSchedule(teamAbbrev) {
    try {
      const response = await this.client.get(`/club-schedule/${teamAbbrev}/week/now`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch schedule for ${teamAbbrev}: ${error.message}`);
    }
  }

  async getLiveScoreboard() {
    try {
      const response = await this.client.get('/score/now');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch live scoreboard: ${error.message}`);
    }
  }

  async getGameCenter(gameId) {
    try {
      const response = await this.client.get(`/gamecenter/${gameId}/landing`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch game center for ${gameId}: ${error.message}`);
    }
  }

  async searchPlayers(query, limit = 20) {
    try {
      const response = await this.client.get(`/search/player?q=${encodeURIComponent(query)}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to search players: ${error.message}`);
    }
  }

  async getTeamStats(teamAbbrev) {
    try {
      const response = await this.client.get(`/club-stats/${teamAbbrev}/now`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch team stats for ${teamAbbrev}: ${error.message}`);
    }
  }

  async getAllPlayersData() {
    try {
      const allPlayers = [];
      const teamPromises = Object.keys(NHL_TEAMS).map(async (teamAbbrev) => {
        try {
          const roster = await this.getTeamRoster(teamAbbrev);
          return roster;
        } catch (error) {
          console.warn(`Failed to fetch roster for ${teamAbbrev}:`, error.message);
          return null;
        }
      });

      const rosters = await Promise.allSettled(teamPromises);
      
      rosters.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          const teamAbbrev = Object.keys(NHL_TEAMS)[index];
          const roster = result.value;
          
          if (roster.forwards) {
            allPlayers.push(...roster.forwards.map(player => ({
              ...player,
              team: teamAbbrev,
              position: this.determinePosition(player.positionCode)
            })));
          }
          
          if (roster.defensemen) {
            allPlayers.push(...roster.defensemen.map(player => ({
              ...player,
              team: teamAbbrev,
              position: 'D'
            })));
          }
          
          if (roster.goalies) {
            allPlayers.push(...roster.goalies.map(player => ({
              ...player,
              team: teamAbbrev,
              position: 'G'
            })));
          }
        }
      });

      return allPlayers;
    } catch (error) {
      throw new Error(`Failed to fetch all players data: ${error.message}`);
    }
  }

  determinePosition(positionCode) {
    const positionMap = {
      'C': 'C',
      'L': 'LW',
      'R': 'RW',
      'D': 'D',
      'G': 'G'
    };
    return positionMap[positionCode] || positionCode;
  }

  async getPlayoffMatchups() {
    try {
      const response = await this.client.get('/tournaments/playoffs/now');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch playoff matchups: ${error.message}`);
    }
  }

  async getPlayerGameLog(playerId, season = '20242025') {
    try {
      const response = await this.client.get(`/player/${playerId}/game-log/${season}/2`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch game log for player ${playerId}: ${error.message}`);
    }
  }

  formatPlayerForFantasy(player) {
    return {
      id: player.id,
      name: `${player.firstName?.default || ''} ${player.lastName?.default || ''}`.trim(),
      team: player.team,
      position: player.position,
      headshot: player.headshot,
      sweaterNumber: player.sweaterNumber,
      birthDate: player.birthDate,
      birthCity: player.birthCity?.default,
      birthCountry: player.birthCountry,
      heightInInches: player.heightInInches,
      weightInPounds: player.weightInPounds,
      shoots: player.shootsCatches,
      isActive: player.isActive,
      isRookie: player.isRookie,
      fantasyEligible: player.isActive && !player.isRookie
    };
  }
}

export default new NHLApiService();