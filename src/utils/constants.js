export const NHL_TEAMS = {
  'ANA': { name: 'Anaheim Ducks', conference: 'Western', division: 'Pacific' },
  'BOS': { name: 'Boston Bruins', conference: 'Eastern', division: 'Atlantic' },
  'BUF': { name: 'Buffalo Sabres', conference: 'Eastern', division: 'Atlantic' },
  'CAR': { name: 'Carolina Hurricanes', conference: 'Eastern', division: 'Metropolitan' },
  'CBJ': { name: 'Columbus Blue Jackets', conference: 'Eastern', division: 'Metropolitan' },
  'CGY': { name: 'Calgary Flames', conference: 'Western', division: 'Pacific' },
  'CHI': { name: 'Chicago Blackhawks', conference: 'Western', division: 'Central' },
  'COL': { name: 'Colorado Avalanche', conference: 'Western', division: 'Central' },
  'DAL': { name: 'Dallas Stars', conference: 'Western', division: 'Central' },
  'DET': { name: 'Detroit Red Wings', conference: 'Eastern', division: 'Atlantic' },
  'EDM': { name: 'Edmonton Oilers', conference: 'Western', division: 'Pacific' },
  'FLA': { name: 'Florida Panthers', conference: 'Eastern', division: 'Atlantic' },
  'LAK': { name: 'Los Angeles Kings', conference: 'Western', division: 'Pacific' },
  'MIN': { name: 'Minnesota Wild', conference: 'Western', division: 'Central' },
  'MTL': { name: 'Montreal Canadiens', conference: 'Eastern', division: 'Atlantic' },
  'NJD': { name: 'New Jersey Devils', conference: 'Eastern', division: 'Metropolitan' },
  'NSH': { name: 'Nashville Predators', conference: 'Western', division: 'Central' },
  'NYI': { name: 'New York Islanders', conference: 'Eastern', division: 'Metropolitan' },
  'NYR': { name: 'New York Rangers', conference: 'Eastern', division: 'Metropolitan' },
  'OTT': { name: 'Ottawa Senators', conference: 'Eastern', division: 'Atlantic' },
  'PHI': { name: 'Philadelphia Flyers', conference: 'Eastern', division: 'Metropolitan' },
  'PIT': { name: 'Pittsburgh Penguins', conference: 'Eastern', division: 'Metropolitan' },
  'SEA': { name: 'Seattle Kraken', conference: 'Western', division: 'Pacific' },
  'SJS': { name: 'San Jose Sharks', conference: 'Western', division: 'Pacific' },
  'STL': { name: 'St. Louis Blues', conference: 'Western', division: 'Central' },
  'TBL': { name: 'Tampa Bay Lightning', conference: 'Eastern', division: 'Atlantic' },
  'TOR': { name: 'Toronto Maple Leafs', conference: 'Eastern', division: 'Atlantic' },
  'UTA': { name: 'Utah Hockey Club', conference: 'Western', division: 'Central' },
  'VAN': { name: 'Vancouver Canucks', conference: 'Western', division: 'Pacific' },
  'VGK': { name: 'Vegas Golden Knights', conference: 'Western', division: 'Pacific' },
  'WPG': { name: 'Winnipeg Jets', conference: 'Western', division: 'Central' },
  'WSH': { name: 'Washington Capitals', conference: 'Eastern', division: 'Metropolitan' }
};

export const PLAYER_POSITIONS = {
  SKATERS: ['C', 'LW', 'RW', 'D'],
  GOALIES: ['G'],
  ALL: ['C', 'LW', 'RW', 'D', 'G']
};

export const STAT_DEFINITIONS = {
  G: 'Goals scored',
  A: 'Assists',
  P: 'Total points (Goals + Assists)',
  SOG: 'Shots on goal',
  HIT: 'Hits delivered',
  BLK: 'Shots blocked',
  W: 'Wins (Goalies)',
  GAA: 'Goals against average (Goalies)',
  'SV%': 'Save percentage (Goalies)',
  SO: 'Shutouts (Goalies)',
  GP: 'Games played',
  TOI: 'Time on ice',
  PPG: 'Power play goals',
  PPA: 'Power play assists',
  SHG: 'Short handed goals',
  SHA: 'Short handed assists',
  PIM: 'Penalty minutes',
  '+/-': 'Plus/minus rating'
};

export const DRAFT_POSITION_ORDER = [
  'C', 'C', 'LW', 'LW', 'RW', 'RW', 'D', 'D', 'D', 'D', 'G', 'G', 'BN', 'BN', 'BN', 'BN'
];

export const MATCHUP_PERIODS = {
  WEEKLY: 'weekly',
  DAILY: 'daily'
};

export const INJURY_STATUS = {
  HEALTHY: 'healthy',
  DAY_TO_DAY: 'day-to-day',
  IR: 'injured-reserve',
  OUT: 'out',
  SUSPENDED: 'suspended'
};

export const TEAM_COLORS = {
  'ANA': { primary: '#F47A38', secondary: '#B9975B' },
  'BOS': { primary: '#FFB81C', secondary: '#000000' },
  'BUF': { primary: '#003087', secondary: '#FFB81C' },
  'CAR': { primary: '#CC0000', secondary: '#000000' },
  'CBJ': { primary: '#002654', secondary: '#CE1126' },
  'CGY': { primary: '#C8102E', secondary: '#F1BE48' },
  'CHI': { primary: '#CF0A2C', secondary: '#000000' },
  'COL': { primary: '#6F263D', secondary: '#236192' },
  'DAL': { primary: '#006847', secondary: '#8F8F8C' },
  'DET': { primary: '#CE1126', secondary: '#FFFFFF' },
  'EDM': { primary: '#041E42', secondary: '#FF4C00' },
  'FLA': { primary: '#041E42', secondary: '#C8102E' },
  'LAK': { primary: '#111111', secondary: '#A2AAAD' },
  'MIN': { primary: '#154734', secondary: '#A6192E' },
  'MTL': { primary: '#AF1E2D', secondary: '#192168' },
  'NJD': { primary: '#CE1126', secondary: '#000000' },
  'NSH': { primary: '#FFB81C', secondary: '#041E42' },
  'NYI': { primary: '#00539B', secondary: '#F47D30' },
  'NYR': { primary: '#0038A8', secondary: '#CE1126' },
  'OTT': { primary: '#CE1126', secondary: '#C69214' },
  'PHI': { primary: '#F74902', secondary: '#000000' },
  'PIT': { primary: '#FCB514', secondary: '#000000' },
  'SEA': { primary: '#001628', secondary: '#99D9D9' },
  'SJS': { primary: '#006D75', secondary: '#EA7200' },
  'STL': { primary: '#002F87', secondary: '#FCB514' },
  'TBL': { primary: '#002868', secondary: '#FFFFFF' },
  'TOR': { primary: '#003E7E', secondary: '#FFFFFF' },
  'UTA': { primary: '#6CACE4', secondary: '#000000' },
  'VAN': { primary: '#00205B', secondary: '#00843D' },
  'VGK': { primary: '#B4975A', secondary: '#333F42' },
  'WPG': { primary: '#041E42', secondary: '#AC162C' },
  'WSH': { primary: '#C8102E', secondary: '#041E42' }
};

export const APP_ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  PLAYERS: '/players',
  LINEUP: '/lineup',
  LEAGUE: '/league',
  DRAFT: '/draft',
  MATCHUP: '/matchup',
  SETTINGS: '/settings',
  AUTH: '/auth'
};

export const LOCAL_STORAGE_KEYS = {
  USER_TOKEN: 'nhl_fantasy_token',
  USER_PREFERENCES: 'nhl_fantasy_preferences',
  DRAFT_SETTINGS: 'nhl_fantasy_draft_settings',
  LEAGUE_SETTINGS: 'nhl_fantasy_league_settings'
};