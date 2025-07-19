import { useState, useEffect, useCallback } from 'react';
import apiManager from '../services/apiManager';

export const useNHLTeams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const data = await apiManager.getNHLTeams();
        setTeams(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  return { teams, loading, error };
};

export const useNHLStandings = () => {
  const [standings, setStandings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        setLoading(true);
        const data = await apiManager.getNHLStandings();
        setStandings(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, []);

  return { standings, loading, error };
};

export const useNHLPlayer = (playerId) => {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlayer = useCallback(async () => {
    if (!playerId) return;

    try {
      setLoading(true);
      const data = await apiManager.getNHLPlayerStats(playerId);
      setPlayer(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [playerId]);

  useEffect(() => {
    fetchPlayer();
  }, [fetchPlayer]);

  return { player, loading, error, refetch: fetchPlayer };
};

export const useNHLTeamRoster = (teamAbbrev) => {
  const [roster, setRoster] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRoster = useCallback(async () => {
    if (!teamAbbrev) return;

    try {
      setLoading(true);
      const data = await apiManager.getNHLTeamRoster(teamAbbrev);
      setRoster(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [teamAbbrev]);

  useEffect(() => {
    fetchRoster();
  }, [fetchRoster]);

  return { roster, loading, error, refetch: fetchRoster };
};

export const useNHLLiveGames = (autoRefresh = true, refreshInterval = 30000) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchGames = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiManager.getNHLLiveScoreboard();
      setGames(data.games || []);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGames();

    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchGames, refreshInterval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fetchGames, autoRefresh, refreshInterval]);

  return { 
    games, 
    loading, 
    error, 
    lastUpdated, 
    refetch: fetchGames 
  };
};

export const useNHLPlayerSearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  const searchPlayers = useCallback(async (searchQuery, limit = 20) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setQuery(searchQuery);
      const data = await apiManager.searchNHLPlayers(searchQuery, limit);
      setResults(data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setQuery('');
    setError(null);
  }, []);

  return { 
    results, 
    loading, 
    error, 
    query,
    searchPlayers, 
    clearResults 
  };
};

export const useNHLAllPlayers = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchAllPlayers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiManager.getAllNHLPlayers();
      setPlayers(data || []);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllPlayers();
  }, [fetchAllPlayers]);

  const filterPlayers = useCallback((filters = {}) => {
    return players.filter(player => {
      if (filters.position && player.position !== filters.position) {
        return false;
      }
      if (filters.team && player.team !== filters.team) {
        return false;
      }
      if (filters.name && !player.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [players]);

  const getPlayersByPosition = useCallback((position) => {
    return players.filter(player => player.position === position);
  }, [players]);

  const getPlayersByTeam = useCallback((team) => {
    return players.filter(player => player.team === team);
  }, [players]);

  return { 
    players, 
    loading, 
    error, 
    lastUpdated,
    refetch: fetchAllPlayers,
    filterPlayers,
    getPlayersByPosition,
    getPlayersByTeam
  };
};