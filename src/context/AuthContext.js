import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('nhl_fantasy_token');
    const userData = localStorage.getItem('nhl_fantasy_user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('nhl_fantasy_token');
        localStorage.removeItem('nhl_fantasy_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual API call to your backend
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      localStorage.setItem('nhl_fantasy_token', data.token);
      localStorage.setItem('nhl_fantasy_user', JSON.stringify(data.user));
      
      setUser(data.user);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username, email, password) => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual API call to your backend
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      const data = await response.json();
      
      localStorage.setItem('nhl_fantasy_token', data.token);
      localStorage.setItem('nhl_fantasy_user', JSON.stringify(data.user));
      
      setUser(data.user);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('nhl_fantasy_token');
    localStorage.removeItem('nhl_fantasy_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const mockLogin = (username) => {
    const mockUser = {
      id: Date.now(),
      username,
      email: `${username}@example.com`,
      leagues: [],
      createdAt: new Date().toISOString()
    };
    
    const mockToken = `mock_token_${Date.now()}`;
    
    localStorage.setItem('nhl_fantasy_token', mockToken);
    localStorage.setItem('nhl_fantasy_user', JSON.stringify(mockUser));
    
    setUser(mockUser);
    setIsAuthenticated(true);
    
    return { success: true };
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    mockLogin // Remove this in production
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};