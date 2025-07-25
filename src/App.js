import React, { useState } from 'react';
import Layout from './components/common/Layout';
import Background from './components/common/Background';
import LandingPage from './components/landing/LandingPage'; 
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import PlayerNews from './components/dashboard/PlayerNews';
import LeagueStandings from './components/dashboard/LeagueStandings';
import JoinLeague from './components/league/JoinLeague';
import CreateLeague from './components/league/CreateLeague';
import PlayerSearch from './components/player/PlayerSearch';
import LineupManager from './components/lineup/LineupManager';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useNHLLiveGames } from './hooks/useNHLData';
import theme, { cssVariables } from './styles/theme';

const AppContent = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [authMode, setAuthMode] = useState('login');
  const { isAuthenticated, loading: authLoading } = useAuth(); 
  const { games, loading, error, lastUpdated } = useNHLLiveGames();

  if (authLoading) {
    return (
      <Background variant="ice">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading NHL Fantasy Platform...</p>
          </div>
        </div>
      </Background>
    );
  }

  // Show landing page if not authenticated
  if (!isAuthenticated && currentView === 'landing') {
    return <LandingPage onGetStarted={() => setAuthMode('login')} />;
  }

  if (!isAuthenticated) {
    return (
      <Background variant="ice">
        {authMode === 'login' ? (
          <LoginForm 
            onSwitchToSignup={() => setAuthMode('signup')}
            onBack={() => setCurrentView('landing')}
          />
        ) : (
          <SignupForm 
            onSwitchToLogin={() => setAuthMode('login')}
            onBack={() => setCurrentView('landing')}
          />
        )}
      </Background>
    );
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome to NHL Fantasy Platform</h2>
        <p className="text-blue-100">
          Manage your fantasy hockey team with real-time NHL data and advanced analytics.
        </p>
      </div>

      {/* Live Games Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Live Games</h3>
          {lastUpdated && (
            <span className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-red-600 py-4">
            Error loading games: {error}
          </div>
        ) : games.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {games.slice(0, 6).map((game, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <div className="font-semibold">{game.awayTeam?.abbrev || 'TBD'}</div>
                    <div className="text-2xl font-bold text-blue-600">{game.awayTeam?.score || 0}</div>
                  </div>
                  <div className="text-center text-gray-500">
                    <div className="text-sm">vs</div>
                    <div className="text-xs">{game.gameState || 'Scheduled'}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{game.homeTeam?.abbrev || 'TBD'}</div>
                    <div className="text-2xl font-bold text-blue-600">{game.homeTeam?.score || 0}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 py-8 text-center">
            No games today
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div 
          onClick={() => setCurrentView('lineup')}
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="text-center">
            <div className="text-3xl mb-2">👥</div>
            <h4 className="font-semibold text-gray-900">My Team</h4>
            <p className="text-sm text-gray-600">Manage your roster</p>
          </div>
        </div>
        
        <div 
          onClick={() => setCurrentView('players')}
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="text-center">
            <div className="text-3xl mb-2">🔍</div>
            <h4 className="font-semibold text-gray-900">Find Players</h4>
            <p className="text-sm text-gray-600">Search & analyze</p>
          </div>
        </div>
        
        <div 
          onClick={() => setCurrentView('standings')}
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="text-center">
            <div className="text-3xl mb-2">📊</div>
            <h4 className="font-semibold text-gray-900">Standings</h4>
            <p className="text-sm text-gray-600">League rankings</p>
          </div>
        </div>
        
        <div 
          onClick={() => setCurrentView('join-league')}
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="text-center">
            <div className="text-3xl mb-2">⚔️</div>
            <h4 className="font-semibold text-gray-900">Join League</h4>
            <p className="text-sm text-gray-600">Find new leagues</p>
          </div>
        </div>
      </div>

      {/* Dashboard Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <PlayerNews />
        <LeagueStandings />
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return renderDashboard();
      case 'players':
        return <PlayerSearch />;
      case 'lineup':
        return <LineupManager />;
      case 'standings':
        return <LeagueStandings />;
      case 'join-league':
        return <JoinLeague onNavigate={setCurrentView} />;
      case 'create-league':
        return <CreateLeague />;
      case 'profile':
        return <div className="text-center py-8 text-gray-500">Profile Settings coming soon!</div>;
      default:
        return renderDashboard();
    }
  };

  return (
    <Background variant="rink">
      <Layout 
        title={currentView === 'dashboard' ? 'Dashboard' : currentView.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        currentView={currentView}
        setCurrentView={setCurrentView}
      >
        {renderContent()}
      </Layout>
    </Background>
  );
};

function App() {
  // Inject CSS variables for theming
  React.useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = cssVariables;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
