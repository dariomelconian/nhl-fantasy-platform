import { useState, useEffect, useCallback } from 'react';
import apiManager from '../services/apiManager';
import yahooApi from '../services/yahooApi';

export const useYahooAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        yahooApi.loadTokensFromStorage();
        const authenticated = yahooApi.isAuthenticated();
        
        if (authenticated) {
          const isValid = await yahooApi.validateToken();
          setIsAuthenticated(isValid);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setError(err.message);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(() => {
    const authUrl = yahooApi.getAuthUrl();
    window.location.href = authUrl;
  }, []);

  const logout = useCallback(() => {
    yahooApi.clearTokens();
    setIsAuthenticated(false);
  }, []);

  const handleAuthCallback = useCallback(async (code) => {
    try {
      setLoading(true);
      await yahooApi.exchangeCodeForTokens(code);
      setIsAuthenticated(true);
      setError(null);
    } catch (err) {
      setError(err.message);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    handleAuthCallback
  };
};

export const useYahooLeagues = () => {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeagues = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiManager.getYahooUserLeagues();
      setLeagues(data.fantasy_content?.users?.[0]?.user?.[1]?.leagues || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeagues();
  }, [fetchLeagues]);

  return { leagues, loading, error, refetch: fetchLeagues };
};

export const useYahooLeague = (leagueKey) => {
  const [league, setLeague] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLeague = useCallback(async () => {
    if (!leagueKey) return;

    try {
      setLoading(true);
      const data = await apiManager.getYahooLeagueSettings(leagueKey);
      setLeague(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [leagueKey]);

  useEffect(() => {
    fetchLeague();
  }, [fetchLeague]);

  return { league, loading, error, refetch: fetchLeague };
};

export const useYahooStandings = (leagueKey) => {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStandings = useCallback(async () => {
    if (!leagueKey) return;

    try {
      setLoading(true);
      const data = await apiManager.getYahooLeagueStandings(leagueKey);
      setStandings(data.fantasy_content?.league?.[1]?.standings || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [leagueKey]);

  useEffect(() => {
    fetchStandings();
  }, [fetchStandings]);

  return { standings, loading, error, refetch: fetchStandings };
};

export const useYahooTeamRoster = (teamKey) => {
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRoster = useCallback(async () => {
    if (!teamKey) return;

    try {
      setLoading(true);
      const data = await apiManager.getYahooTeamRoster(teamKey);
      setRoster(data.fantasy_content?.team?.[1]?.roster || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [teamKey]);

  useEffect(() => {
    fetchRoster();
  }, [fetchRoster]);

  return { roster, loading, error, refetch: fetchRoster };
};

export const useYahooFreeAgents = (leagueKey, position = null) => {
  const [freeAgents, setFreeAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFreeAgents = useCallback(async (count = 50) => {
    if (!leagueKey) return;

    try {
      setLoading(true);
      const data = await apiManager.getYahooFreeAgents(leagueKey, position, count);
      setFreeAgents(data.fantasy_content?.league?.[1]?.players || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [leagueKey, position]);

  useEffect(() => {
    fetchFreeAgents();
  }, [fetchFreeAgents]);

  return { 
    freeAgents, 
    loading, 
    error, 
    refetch: fetchFreeAgents 
  };
};

export const useYahooMatchups = (leagueKey, week = null) => {
  const [matchups, setMatchups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMatchups = useCallback(async () => {
    if (!leagueKey) return;

    try {
      setLoading(true);
      const data = await apiManager.getYahooMatchups(leagueKey, week);
      setMatchups(data.fantasy_content?.league?.[1]?.scoreboard || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [leagueKey, week]);

  useEffect(() => {
    fetchMatchups();
  }, [fetchMatchups]);

  return { matchups, loading, error, refetch: fetchMatchups };
};

export const useYahooTransactions = (leagueKey, type = null) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async () => {
    if (!leagueKey) return;

    try {
      setLoading(true);
      const data = await apiManager.getYahooLeagueTransactions?.(leagueKey, type);
      setTransactions(data?.fantasy_content?.league?.[1]?.transactions || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [leagueKey, type]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return { transactions, loading, error, refetch: fetchTransactions };
};