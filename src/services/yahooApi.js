import axios from 'axios';
import API_CONFIG from '../config/api';

class YahooApiService {
  constructor() {
    this.baseURL = API_CONFIG.YAHOO.BASE_URL;
    this.clientId = API_CONFIG.YAHOO.AUTH.CLIENT_ID;
    this.clientSecret = API_CONFIG.YAHOO.AUTH.CLIENT_SECRET;
    this.redirectUri = API_CONFIG.YAHOO.AUTH.REDIRECT_URI;
    this.accessToken = null;
    this.refreshToken = null;
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    this.client.interceptors.request.use(
      config => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      response => response,
      async error => {
        if (error.response?.status === 401 && this.refreshToken) {
          try {
            await this.refreshAccessToken();
            const originalRequest = error.config;
            originalRequest.headers.Authorization = `Bearer ${this.accessToken}`;
            return this.client.request(originalRequest);
          } catch (refreshError) {
            console.error('Failed to refresh token:', refreshError);
            this.clearTokens();
            window.location.href = '/auth';
          }
        }
        console.error('Yahoo API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  setTokens(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('yahoo_access_token', accessToken);
    localStorage.setItem('yahoo_refresh_token', refreshToken);
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('yahoo_access_token');
    localStorage.removeItem('yahoo_refresh_token');
  }

  loadTokensFromStorage() {
    this.accessToken = localStorage.getItem('yahoo_access_token');
    this.refreshToken = localStorage.getItem('yahoo_refresh_token');
  }

  getAuthUrl() {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'fspt-r fspt-w'
    });
    return `https://api.login.yahoo.com/oauth2/request_auth?${params.toString()}`;
  }

  async exchangeCodeForTokens(code) {
    try {
      const response = await axios.post('https://api.login.yahoo.com/oauth2/get_token', {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: this.redirectUri,
        client_id: this.clientId,
        client_secret: this.clientSecret
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const { access_token, refresh_token } = response.data;
      this.setTokens(access_token, refresh_token);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to exchange code for tokens: ${error.message}`);
    }
  }

  async refreshAccessToken() {
    try {
      const response = await axios.post('https://api.login.yahoo.com/oauth2/get_token', {
        grant_type: 'refresh_token',
        refresh_token: this.refreshToken,
        client_id: this.clientId,
        client_secret: this.clientSecret
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const { access_token, refresh_token } = response.data;
      this.setTokens(access_token, refresh_token);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to refresh access token: ${error.message}`);
    }
  }

  async getUserLeagues() {
    try {
      const response = await this.client.get('/users;use_login=1/leagues');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch user leagues: ${error.message}`);
    }
  }

  async getLeagueSettings(leagueKey) {
    try {
      const response = await this.client.get(`/league/${leagueKey}/settings`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch league settings: ${error.message}`);
    }
  }

  async getLeagueStandings(leagueKey) {
    try {
      const response = await this.client.get(`/league/${leagueKey}/standings`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch league standings: ${error.message}`);
    }
  }

  async getLeagueTeams(leagueKey) {
    try {
      const response = await this.client.get(`/league/${leagueKey}/teams`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch league teams: ${error.message}`);
    }
  }

  async getTeamRoster(teamKey) {
    try {
      const response = await this.client.get(`/team/${teamKey}/roster`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch team roster: ${error.message}`);
    }
  }

  async getPlayerStats(leagueKey, playerKeys, statType = 'season') {
    try {
      const playerKeyString = Array.isArray(playerKeys) ? playerKeys.join(',') : playerKeys;
      const response = await this.client.get(`/league/${leagueKey}/players;player_keys=${playerKeyString}/stats;type=${statType}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch player stats: ${error.message}`);
    }
  }

  async getFreeAgents(leagueKey, position = null, count = 50) {
    try {
      let url = `/league/${leagueKey}/players;status=A;count=${count}`;
      if (position) {
        url += `;position=${position}`;
      }
      const response = await this.client.get(url);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch free agents: ${error.message}`);
    }
  }

  async getLeagueTransactions(leagueKey, type = null) {
    try {
      let url = `/league/${leagueKey}/transactions`;
      if (type) {
        url += `;type=${type}`;
      }
      const response = await this.client.get(url);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch league transactions: ${error.message}`);
    }
  }

  async getMatchups(leagueKey, week = null) {
    try {
      let url = `/league/${leagueKey}/scoreboard`;
      if (week) {
        url += `;week=${week}`;
      }
      const response = await this.client.get(url);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch matchups: ${error.message}`);
    }
  }

  async addPlayer(teamKey, playerKey) {
    try {
      const response = await this.client.post(`/league/${teamKey.split('.')[0]}.${teamKey.split('.')[1]}.${teamKey.split('.')[2]}/transactions`, {
        transaction: {
          type: 'add',
          player: {
            player_key: playerKey,
            transaction_data: {
              type: 'add',
              source_type: 'freeagents'
            }
          }
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to add player: ${error.message}`);
    }
  }

  async dropPlayer(teamKey, playerKey) {
    try {
      const response = await this.client.post(`/league/${teamKey.split('.')[0]}.${teamKey.split('.')[1]}.${teamKey.split('.')[2]}/transactions`, {
        transaction: {
          type: 'drop',
          player: {
            player_key: playerKey,
            transaction_data: {
              type: 'drop'
            }
          }
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to drop player: ${error.message}`);
    }
  }

  async tradePlayer(fromTeamKey, toTeamKey, fromPlayerKey, toPlayerKey) {
    try {
      const response = await this.client.post(`/league/${fromTeamKey.split('.')[0]}.${fromTeamKey.split('.')[1]}.${fromTeamKey.split('.')[2]}/transactions`, {
        transaction: {
          type: 'trade',
          trader_team_key: fromTeamKey,
          tradee_team_key: toTeamKey,
          trade_note: 'Trade via NHL Fantasy Platform',
          players: [
            {
              player_key: fromPlayerKey,
              transaction_data: {
                type: 'trade',
                source_team_key: fromTeamKey,
                destination_team_key: toTeamKey
              }
            },
            {
              player_key: toPlayerKey,
              transaction_data: {
                type: 'trade',
                source_team_key: toTeamKey,
                destination_team_key: fromTeamKey
              }
            }
          ]
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to trade player: ${error.message}`);
    }
  }

  async setLineup(teamKey, playerMovements) {
    try {
      const response = await this.client.post(`/team/${teamKey}/roster`, {
        roster: {
          coverage_type: 'date',
          date: new Date().toISOString().split('T')[0],
          players: playerMovements.map(movement => ({
            player_key: movement.playerKey,
            position: movement.position
          }))
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to set lineup: ${error.message}`);
    }
  }

  isAuthenticated() {
    return !!this.accessToken;
  }

  async validateToken() {
    try {
      await this.getUserLeagues();
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new YahooApiService();