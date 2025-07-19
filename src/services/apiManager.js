import nhlApi from './nhlApi';
import yahooApi from './yahooApi';
import cache from '../utils/cache';
import { CACHE_KEYS, CACHE_DURATION, REQUEST_LIMITS } from '../config/api';

class ApiManager {
  constructor() {
    this.requestQueue = [];
    this.activeRequests = 0;
    this.maxConcurrentRequests = 5;
    this.rateLimits = {
      nhl: { requests: 0, resetTime: Date.now() + 60000 },
      yahoo: { requests: 0, resetTime: Date.now() + 60000 }
    };
    
    this.initializeRateLimitReset();
  }

  initializeRateLimitReset() {
    setInterval(() => {
      const now = Date.now();
      if (now >= this.rateLimits.nhl.resetTime) {
        this.rateLimits.nhl.requests = 0;
        this.rateLimits.nhl.resetTime = now + 60000;
      }
      if (now >= this.rateLimits.yahoo.resetTime) {
        this.rateLimits.yahoo.requests = 0;
        this.rateLimits.yahoo.resetTime = now + 60000;
      }
    }, 1000);
  }

  async executeWithRateLimit(apiType, operation) {
    const limit = apiType === 'nhl' ? REQUEST_LIMITS.NHL_API : REQUEST_LIMITS.YAHOO_API;
    
    if (this.rateLimits[apiType].requests >= limit.REQUESTS_PER_MINUTE) {
      const waitTime = this.rateLimits[apiType].resetTime - Date.now();
      if (waitTime > 0) {
        console.log(`Rate limit reached for ${apiType}, waiting ${waitTime}ms`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    this.rateLimits[apiType].requests++;
    return await operation();
  }

  async getNHLTeams() {
    const cacheKey = CACHE_KEYS.NHL_TEAMS;
    return await cache.getOrFetch(
      cacheKey,
      () => this.executeWithRateLimit('nhl', () => nhlApi.getTeams()),
      CACHE_DURATION.LONG
    );
  }

  async getNHLStandings() {
    const cacheKey = 'nhl_standings';
    return await cache.getOrFetch(
      cacheKey,
      () => this.executeWithRateLimit('nhl', () => nhlApi.getStandings()),
      CACHE_DURATION.MEDIUM
    );
  }

  async getNHLPlayerStats(playerId) {
    const cacheKey = `${CACHE_KEYS.PLAYER_STATS}_${playerId}`;
    return await cache.getOrFetch(
      cacheKey,
      () => this.executeWithRateLimit('nhl', () => nhlApi.getPlayerStats(playerId)),
      CACHE_DURATION.MEDIUM
    );
  }

  async getNHLTeamRoster(teamAbbrev) {
    const cacheKey = `nhl_roster_${teamAbbrev}`;
    return await cache.getOrFetch(
      cacheKey,
      () => this.executeWithRateLimit('nhl', () => nhlApi.getTeamRoster(teamAbbrev)),
      CACHE_DURATION.MEDIUM
    );
  }

  async getNHLLiveScoreboard() {
    const cacheKey = CACHE_KEYS.LIVE_GAMES;
    return await cache.getOrFetch(
      cacheKey,
      () => this.executeWithRateLimit('nhl', () => nhlApi.getLiveScoreboard()),
      CACHE_DURATION.SHORT
    );
  }

  async searchNHLPlayers(query, limit = 20) {
    const cacheKey = `nhl_search_${query.toLowerCase()}_${limit}`;
    return await cache.getOrFetch(
      cacheKey,
      () => this.executeWithRateLimit('nhl', () => nhlApi.searchPlayers(query, limit)),
      CACHE_DURATION.MEDIUM
    );
  }

  async getAllNHLPlayers() {
    const cacheKey = CACHE_KEYS.NHL_PLAYERS;
    return await cache.getOrFetch(
      cacheKey,
      () => this.executeWithRateLimit('nhl', () => nhlApi.getAllPlayersData()),
      CACHE_DURATION.LONG
    );
  }

  async getYahooUserLeagues() {
    if (!yahooApi.isAuthenticated()) {
      throw new Error('User not authenticated with Yahoo');
    }

    const cacheKey = CACHE_KEYS.YAHOO_LEAGUES;
    return await cache.getOrFetch(
      cacheKey,
      () => this.executeWithRateLimit('yahoo', () => yahooApi.getUserLeagues()),
      CACHE_DURATION.MEDIUM
    );
  }

  async getYahooLeagueSettings(leagueKey) {
    if (!yahooApi.isAuthenticated()) {
      throw new Error('User not authenticated with Yahoo');
    }

    const cacheKey = `yahoo_league_settings_${leagueKey}`;
    return await cache.getOrFetch(
      cacheKey,
      () => this.executeWithRateLimit('yahoo', () => yahooApi.getLeagueSettings(leagueKey)),
      CACHE_DURATION.LONG
    );
  }

  async getYahooLeagueStandings(leagueKey) {
    if (!yahooApi.isAuthenticated()) {
      throw new Error('User not authenticated with Yahoo');
    }

    const cacheKey = `yahoo_standings_${leagueKey}`;
    return await cache.getOrFetch(
      cacheKey,
      () => this.executeWithRateLimit('yahoo', () => yahooApi.getLeagueStandings(leagueKey)),
      CACHE_DURATION.MEDIUM
    );
  }

  async getYahooTeamRoster(teamKey) {
    if (!yahooApi.isAuthenticated()) {
      throw new Error('User not authenticated with Yahoo');
    }

    const cacheKey = `yahoo_roster_${teamKey}`;
    return await cache.getOrFetch(
      cacheKey,
      () => this.executeWithRateLimit('yahoo', () => yahooApi.getTeamRoster(teamKey)),
      CACHE_DURATION.SHORT
    );
  }

  async getYahooFreeAgents(leagueKey, position = null, count = 50) {
    if (!yahooApi.isAuthenticated()) {
      throw new Error('User not authenticated with Yahoo');
    }

    const cacheKey = `yahoo_free_agents_${leagueKey}_${position || 'all'}_${count}`;
    return await cache.getOrFetch(
      cacheKey,
      () => this.executeWithRateLimit('yahoo', () => yahooApi.getFreeAgents(leagueKey, position, count)),
      CACHE_DURATION.SHORT
    );
  }

  async getYahooMatchups(leagueKey, week = null) {
    if (!yahooApi.isAuthenticated()) {
      throw new Error('User not authenticated with Yahoo');
    }

    const cacheKey = `yahoo_matchups_${leagueKey}_${week || 'current'}`;
    return await cache.getOrFetch(
      cacheKey,
      () => this.executeWithRateLimit('yahoo', () => yahooApi.getMatchups(leagueKey, week)),
      CACHE_DURATION.SHORT
    );
  }

  async getCombinedPlayerData(playerId) {
    try {
      const [nhlStats, yahooData] = await Promise.allSettled([
        this.getNHLPlayerStats(playerId),
        yahooApi.isAuthenticated() ? this.getYahooPlayerStats(playerId) : null
      ]);

      return {
        nhl: nhlStats.status === 'fulfilled' ? nhlStats.value : null,
        yahoo: yahooData && yahooData.status === 'fulfilled' ? yahooData.value : null,
        combined: this.mergePlayerData(
          nhlStats.status === 'fulfilled' ? nhlStats.value : null,
          yahooData && yahooData.status === 'fulfilled' ? yahooData.value : null
        )
      };
    } catch (error) {
      throw new Error(`Failed to get combined player data: ${error.message}`);
    }
  }

  mergePlayerData(nhlData, yahooData) {
    if (!nhlData) return yahooData;
    if (!yahooData) return nhlData;

    return {
      ...nhlData,
      yahoo: yahooData,
      fantasyPoints: this.calculateFantasyPoints(nhlData),
      ownership: yahooData.ownership || 0,
      trend: yahooData.trend || 'stable'
    };
  }

  calculateFantasyPoints(playerStats, categories = null) {
    if (!playerStats || !playerStats.seasonTotals) return 0;

    const stats = playerStats.seasonTotals[0] || {};
    const defaultCategories = {
      goals: 6,
      assists: 4,
      points: 1,
      shots: 0.5,
      hits: 0.5,
      blocks: 0.5,
      wins: 5,
      saves: 0.2,
      shutouts: 3
    };

    const weights = categories || defaultCategories;
    let points = 0;

    points += (stats.goals || 0) * weights.goals;
    points += (stats.assists || 0) * weights.assists;
    points += (stats.shots || 0) * weights.shots;
    points += (stats.hits || 0) * weights.hits;
    points += (stats.blockedShots || 0) * weights.blocks;

    if (stats.wins) points += stats.wins * weights.wins;
    if (stats.saves) points += stats.saves * weights.saves;
    if (stats.shutouts) points += stats.shutouts * weights.shutouts;

    return Math.round(points * 100) / 100;
  }

  invalidateCache(pattern) {
    return cache.invalidatePattern(pattern);
  }

  getCacheStats() {
    return cache.getStats();
  }

  clearCache() {
    cache.clear();
  }

  async healthCheck() {
    const results = {
      nhl: { status: 'unknown', latency: 0 },
      yahoo: { status: 'unknown', latency: 0 },
      cache: cache.getStats()
    };

    try {
      const nhlStart = Date.now();
      await nhlApi.getTeams();
      results.nhl = {
        status: 'healthy',
        latency: Date.now() - nhlStart
      };
    } catch (error) {
      results.nhl = {
        status: 'error',
        error: error.message,
        latency: 0
      };
    }

    if (yahooApi.isAuthenticated()) {
      try {
        const yahooStart = Date.now();
        await yahooApi.getUserLeagues();
        results.yahoo = {
          status: 'healthy',
          latency: Date.now() - yahooStart
        };
      } catch (error) {
        results.yahoo = {
          status: 'error',
          error: error.message,
          latency: 0
        };
      }
    } else {
      results.yahoo.status = 'not_authenticated';
    }

    return results;
  }

  getRateLimitStatus() {
    return {
      nhl: {
        used: this.rateLimits.nhl.requests,
        limit: REQUEST_LIMITS.NHL_API.REQUESTS_PER_MINUTE,
        resetTime: new Date(this.rateLimits.nhl.resetTime)
      },
      yahoo: {
        used: this.rateLimits.yahoo.requests,
        limit: REQUEST_LIMITS.YAHOO_API.REQUESTS_PER_MINUTE,
        resetTime: new Date(this.rateLimits.yahoo.resetTime)
      }
    };
  }
}

export default new ApiManager();