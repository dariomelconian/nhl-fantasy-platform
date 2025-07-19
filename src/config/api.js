const API_CONFIG = {
  NHL: {
    BASE_URL: 'https://api-web.nhle.com/v1',
    ENDPOINTS: {
      TEAMS: '/teams',
      STANDINGS: '/standings/now',
      PLAYER_STATS: '/player/{playerId}/landing',
      TEAM_SCHEDULE: '/club-schedule/{teamAbbrev}/week/now',
      LIVE_SCOREBOARD: '/score/now',
      ROSTER: '/roster/{teamAbbrev}/current',
      PLAYER_SEARCH: '/search/player',
      SEASON_STATS: '/club-stats/{teamAbbrev}/now',
      GAME_CENTER: '/gamecenter/{gameId}/landing'
    }
  },
  YAHOO: {
    BASE_URL: 'https://fantasysports.yahooapis.com/fantasy/v2',
    ENDPOINTS: {
      USER_LEAGUES: '/users;use_login=1/leagues',
      LEAGUE_SETTINGS: '/league/{leagueKey}/settings',
      LEAGUE_STANDINGS: '/league/{leagueKey}/standings',
      LEAGUE_TEAMS: '/league/{leagueKey}/teams',
      TEAM_ROSTER: '/team/{teamKey}/roster',
      PLAYER_STATS: '/league/{leagueKey}/players;player_keys={playerKeys}/stats',
      FREE_AGENTS: '/league/{leagueKey}/players;status=A;count=50',
      TRANSACTIONS: '/league/{leagueKey}/transactions',
      MATCHUPS: '/league/{leagueKey}/scoreboard'
    },
    AUTH: {
      CLIENT_ID: process.env.REACT_APP_YAHOO_CLIENT_ID,
      CLIENT_SECRET: process.env.REACT_APP_YAHOO_CLIENT_SECRET,
      REDIRECT_URI: process.env.REACT_APP_YAHOO_REDIRECT_URI || 'http://localhost:3000/auth/callback'
    }
  }
};

export const FANTASY_CATEGORIES = {
  SKATER: [
    { key: 'G', name: 'Goals', abbrev: 'G' },
    { key: 'A', name: 'Assists', abbrev: 'A' },
    { key: 'P', name: 'Points', abbrev: 'P' },
    { key: 'SOG', name: 'Shots on Goal', abbrev: 'SOG' },
    { key: 'HIT', name: 'Hits', abbrev: 'HIT' },
    { key: 'BLK', name: 'Blocks', abbrev: 'BLK' }
  ],
  GOALIE: [
    { key: 'W', name: 'Wins', abbrev: 'W' },
    { key: 'GAA', name: 'Goals Against Average', abbrev: 'GAA' },
    { key: 'SV%', name: 'Save Percentage', abbrev: 'SV%' },
    { key: 'SO', name: 'Shutouts', abbrev: 'SO' }
  ]
};

export const LEAGUE_SETTINGS = {
  MIN_TEAMS: 4,
  MAX_TEAMS: 14,
  DEFAULT_TEAMS: 8,
  POSITIONS: {
    C: { name: 'Center', min: 1, max: 3 },
    LW: { name: 'Left Wing', min: 1, max: 3 },
    RW: { name: 'Right Wing', min: 1, max: 3 },
    D: { name: 'Defense', min: 2, max: 6 },
    G: { name: 'Goalie', min: 1, max: 2 },
    BN: { name: 'Bench', min: 3, max: 8 },
    IR: { name: 'Injured Reserve', min: 0, max: 3 }
  },
  DRAFT_TYPES: ['snake', 'linear'],
  MATCHUP_TYPES: ['head_to_head', 'rotisserie']
};

export const CACHE_KEYS = {
  NHL_TEAMS: 'nhl_teams',
  NHL_PLAYERS: 'nhl_players',
  PLAYER_STATS: 'player_stats',
  LIVE_GAMES: 'live_games',
  YAHOO_LEAGUES: 'yahoo_leagues',
  USER_PROFILE: 'user_profile'
};

export const CACHE_DURATION = {
  SHORT: 5 * 60 * 1000,    // 5 minutes
  MEDIUM: 30 * 60 * 1000,  // 30 minutes
  LONG: 2 * 60 * 60 * 1000  // 2 hours
};

export const REQUEST_LIMITS = {
  NHL_API: {
    REQUESTS_PER_MINUTE: 60,
    REQUESTS_PER_HOUR: 1000
  },
  YAHOO_API: {
    REQUESTS_PER_MINUTE: 30,
    REQUESTS_PER_HOUR: 500
  }
};

export default API_CONFIG;