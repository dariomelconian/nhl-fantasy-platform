// Database Schema and Mock Implementation
// In production, replace with actual database (Firebase, Supabase, PostgreSQL, etc.)

class DatabaseService {
  constructor() {
    this.data = {
      users: new Map(),
      leagues: new Map(), 
      teams: new Map(),
      players: new Map(),
      rosters: new Map(),
      drafts: new Map(),
      waivers: new Map(),
      transactions: new Map(),
    };
    
    this.initializeMockData();
  }

  // USER MANAGEMENT
  async createUser(userData) {
    const userId = `user_${Date.now()}`;
    const user = {
      id: userId,
      username: userData.username,
      email: userData.email,
      avatar: userData.avatar || null,
      leagues: [],
      teams: [],
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      preferences: {
        notifications: true,
        theme: 'light',
        timezone: 'America/New_York'
      }
    };
    
    this.data.users.set(userId, user);
    return user;
  }

  async getUserById(userId) {
    return this.data.users.get(userId);
  }

  async updateUser(userId, updates) {
    const user = this.data.users.get(userId);
    if (!user) throw new Error('User not found');
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date().toISOString() };
    this.data.users.set(userId, updatedUser);
    return updatedUser;
  }

  // LEAGUE MANAGEMENT
  async createLeague(leagueData, creatorId) {
    const leagueId = `league_${Date.now()}`;
    const leagueCode = this.generateLeagueCode();
    
    const league = {
      id: leagueId,
      code: leagueCode,
      name: leagueData.name,
      description: leagueData.description || '',
      commissionerId: creatorId,
      maxTeams: leagueData.maxTeams || 8,
      currentTeams: 1, // Creator's team
      entryFee: leagueData.entryFee || 0,
      isPublic: leagueData.isPublic || true,
      password: leagueData.password || null,
      status: 'draft_pending', // draft_pending, drafting, active, completed
      gameMode: leagueData.gameMode || 'categories',
      
      // Draft Settings
      draftDate: leagueData.draftDate,
      draftType: leagueData.draftType || 'snake',
      draftOrder: [],
      currentDraftPick: 0,
      
      // Scoring Settings
      categories: leagueData.categories || [
        'G', 'A', 'P', 'SOG', 'HIT', 'BLK', 'W', 'GAA', 'SV%', 'SO'
      ],
      scoring: leagueData.scoring || {},
      
      // Roster Settings
      rosterPositions: leagueData.rosterPositions || {
        C: 2, LW: 2, RW: 2, D: 4, G: 1, BN: 4, IR: 2
      },
      
      // Season Settings
      seasonStart: leagueData.seasonStart || new Date().toISOString(),
      seasonEnd: leagueData.seasonEnd || new Date(Date.now() + 365*24*60*60*1000).toISOString(),
      playoffStart: leagueData.playoffStart || null,
      
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.data.leagues.set(leagueId, league);
    
    // Create commissioner's team
    await this.createTeam({
      name: `${leagueData.creatorUsername}'s Team`,
      leagueId,
      ownerId: creatorId
    });

    return league;
  }

  async getLeagueById(leagueId) {
    return this.data.leagues.get(leagueId);
  }

  async getLeagueByCode(code) {
    return Array.from(this.data.leagues.values()).find(league => league.code === code);
  }

  async getPublicLeagues(limit = 20) {
    return Array.from(this.data.leagues.values())
      .filter(league => league.isPublic && league.status === 'draft_pending')
      .slice(0, limit);
  }

  async joinLeague(leagueId, userId, password = null) {
    const league = this.data.leagues.get(leagueId);
    if (!league) throw new Error('League not found');
    
    if (league.currentTeams >= league.maxTeams) {
      throw new Error('League is full');
    }
    
    if (!league.isPublic && league.password !== password) {
      throw new Error('Invalid password');
    }

    // Check if user already has a team in this league
    const existingTeam = Array.from(this.data.teams.values())
      .find(team => team.leagueId === leagueId && team.ownerId === userId);
    
    if (existingTeam) {
      throw new Error('User already has a team in this league');
    }

    // Create team for user
    const user = await this.getUserById(userId);
    await this.createTeam({
      name: `${user.username}'s Team`,
      leagueId,
      ownerId: userId
    });

    // Update league
    league.currentTeams += 1;
    league.updatedAt = new Date().toISOString();
    this.data.leagues.set(leagueId, league);

    return league;
  }

  // TEAM MANAGEMENT
  async createTeam(teamData) {
    const teamId = `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const team = {
      id: teamId,
      name: teamData.name,
      leagueId: teamData.leagueId,
      ownerId: teamData.ownerId,
      avatar: teamData.avatar || null,
      
      // Team Stats
      wins: 0,
      losses: 0,
      ties: 0,
      points: 0,
      rank: 0,
      
      // Roster Management
      roster: {
        C: [null, null],
        LW: [null, null], 
        RW: [null, null],
        D: [null, null, null, null],
        G: [null],
        BN: [null, null, null, null],
        IR: []
      },
      
      // Draft Status
      draftPosition: 0,
      autopickEnabled: false,
      
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.data.teams.set(teamId, team);
    return team;
  }

  async getTeamById(teamId) {
    return this.data.teams.get(teamId);
  }

  async getTeamsByLeague(leagueId) {
    return Array.from(this.data.teams.values())
      .filter(team => team.leagueId === leagueId);
  }

  async getUserTeams(userId) {
    return Array.from(this.data.teams.values())
      .filter(team => team.ownerId === userId);
  }

  // PLAYER MANAGEMENT
  async addPlayerToRoster(teamId, playerId, position) {
    const team = this.data.teams.get(teamId);
    if (!team) throw new Error('Team not found');

    const player = this.data.players.get(playerId);
    if (!player) throw new Error('Player not found');

    // Check if position slot is available
    const positionSlots = team.roster[position];
    if (!positionSlots) throw new Error('Invalid position');

    const emptySlotIndex = positionSlots.findIndex(slot => slot === null);
    if (emptySlotIndex === -1) throw new Error('No available slots for this position');

    // Add player to roster
    team.roster[position][emptySlotIndex] = {
      playerId,
      addedAt: new Date().toISOString(),
      status: 'active'
    };

    team.updatedAt = new Date().toISOString();
    this.data.teams.set(teamId, team);

    // Record transaction
    await this.recordTransaction({
      type: 'add',
      teamId,
      playerId,
      position,
      timestamp: new Date().toISOString()
    });

    return team;
  }

  async removePlayerFromRoster(teamId, playerId) {
    const team = this.data.teams.get(teamId);
    if (!team) throw new Error('Team not found');

    // Find and remove player from roster
    let removed = false;
    for (const position in team.roster) {
      const positionSlots = team.roster[position];
      const playerIndex = positionSlots.findIndex(slot => 
        slot && slot.playerId === playerId
      );
      
      if (playerIndex !== -1) {
        team.roster[position][playerIndex] = null;
        removed = true;
        break;
      }
    }

    if (!removed) throw new Error('Player not found on roster');

    team.updatedAt = new Date().toISOString();
    this.data.teams.set(teamId, team);

    // Record transaction
    await this.recordTransaction({
      type: 'drop',
      teamId,
      playerId,
      timestamp: new Date().toISOString()
    });

    return team;
  }

  // DRAFT MANAGEMENT
  async startDraft(leagueId) {
    const league = this.data.leagues.get(leagueId);
    if (!league) throw new Error('League not found');

    const teams = await this.getTeamsByLeague(leagueId);
    if (teams.length < 2) throw new Error('Need at least 2 teams to start draft');

    // Generate draft order
    const shuffledTeams = [...teams].sort(() => Math.random() - 0.5);
    const draftOrder = shuffledTeams.map(team => team.id);

    league.status = 'drafting';
    league.draftOrder = draftOrder;
    league.currentDraftPick = 0;
    league.updatedAt = new Date().toISOString();

    // Create draft data
    const draftId = `draft_${leagueId}`;
    const draft = {
      id: draftId,
      leagueId,
      status: 'active',
      currentPick: 0,
      currentTeam: draftOrder[0],
      picks: [],
      timePerPick: 90, // seconds
      startedAt: new Date().toISOString()
    };

    this.data.drafts.set(draftId, draft);
    this.data.leagues.set(leagueId, league);

    return draft;
  }

  async makeDraftPick(draftId, teamId, playerId) {
    const draft = this.data.drafts.get(draftId);
    if (!draft) throw new Error('Draft not found');

    if (draft.status !== 'active') throw new Error('Draft is not active');

    const league = this.data.leagues.get(draft.leagueId);
    const currentTeamId = league.draftOrder[draft.currentPick % league.draftOrder.length];
    
    if (teamId !== currentTeamId) throw new Error('Not your turn to pick');

    // Check if player is available
    const existingPick = draft.picks.find(pick => pick.playerId === playerId);
    if (existingPick) throw new Error('Player already drafted');

    // Make the pick
    const pick = {
      round: Math.floor(draft.currentPick / league.draftOrder.length) + 1,
      pick: draft.currentPick + 1,
      teamId,
      playerId,
      timestamp: new Date().toISOString()
    };

    draft.picks.push(pick);
    draft.currentPick += 1;

    // Check if draft is complete
    const totalRounds = Object.values(league.rosterPositions).reduce((sum, count) => sum + count, 0);
    if (draft.currentPick >= league.draftOrder.length * totalRounds) {
      draft.status = 'completed';
      league.status = 'active';
    } else {
      // Update current team for next pick
      const nextPickIndex = draft.currentPick % league.draftOrder.length;
      const isSnakeDraft = league.draftType === 'snake';
      const currentRound = Math.floor(draft.currentPick / league.draftOrder.length);
      
      if (isSnakeDraft && currentRound % 2 === 1) {
        // Reverse order for odd rounds in snake draft
        draft.currentTeam = league.draftOrder[league.draftOrder.length - 1 - nextPickIndex];
      } else {
        draft.currentTeam = league.draftOrder[nextPickIndex];
      }
    }

    this.data.drafts.set(draftId, draft);
    this.data.leagues.set(draft.leagueId, league);

    return pick;
  }

  // TRANSACTION MANAGEMENT
  async recordTransaction(transactionData) {
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const transaction = {
      id: transactionId,
      ...transactionData,
      status: 'completed',
      createdAt: new Date().toISOString()
    };

    this.data.transactions.set(transactionId, transaction);
    return transaction;
  }

  async getTeamTransactions(teamId, limit = 50) {
    return Array.from(this.data.transactions.values())
      .filter(txn => txn.teamId === teamId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  }

  // WAIVER WIRE
  async addToWaivers(playerId, droppedByTeamId) {
    const waiverClaim = {
      id: `waiver_${Date.now()}`,
      playerId,
      droppedByTeamId, 
      claimDeadline: new Date(Date.now() + 24*60*60*1000).toISOString(), // 24 hours
      claims: [],
      status: 'active',
      createdAt: new Date().toISOString()
    };

    this.data.waivers.set(waiverClaim.id, waiverClaim);
    return waiverClaim;
  }

  async submitWaiverClaim(waiverClaimId, teamId, priority) {
    const waiverClaim = this.data.waivers.get(waiverClaimId);
    if (!waiverClaim) throw new Error('Waiver claim not found');

    if (waiverClaim.status !== 'active') throw new Error('Waiver claim is no longer active');

    // Add or update team's claim
    const existingClaimIndex = waiverClaim.claims.findIndex(claim => claim.teamId === teamId);
    
    if (existingClaimIndex !== -1) {
      waiverClaim.claims[existingClaimIndex].priority = priority;
      waiverClaim.claims[existingClaimIndex].updatedAt = new Date().toISOString();
    } else {
      waiverClaim.claims.push({
        teamId,
        priority,
        submittedAt: new Date().toISOString()
      });
    }

    this.data.waivers.set(waiverClaimId, waiverClaim);
    return waiverClaim;
  }

  // UTILITY METHODS
  generateLeagueCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  initializeMockData() {
    // Initialize with some mock NHL players data
    // This would be populated from the NHL API in production
    const mockPlayers = [
      { id: 'player_mcdavid', name: 'Connor McDavid', team: 'EDM', position: 'C' },
      { id: 'player_draisaitl', name: 'Leon Draisaitl', team: 'EDM', position: 'C' },
      { id: 'player_pastrnak', name: 'David Pastrnak', team: 'BOS', position: 'RW' },
      // ... more players would be added
    ];

    mockPlayers.forEach(player => {
      this.data.players.set(player.id, player);
    });
  }

  // Development helper methods
  clearAllData() {
    this.data = {
      users: new Map(),
      leagues: new Map(),
      teams: new Map(), 
      players: new Map(),
      rosters: new Map(),
      drafts: new Map(),
      waivers: new Map(),
      transactions: new Map(),
    };
    this.initializeMockData();
  }

  exportData() {
    const exportObj = {};
    for (const [key, map] of Object.entries(this.data)) {
      exportObj[key] = Array.from(map.entries());
    }
    return exportObj;
  }
}

// Create singleton instance
const databaseService = new DatabaseService();

export default databaseService;