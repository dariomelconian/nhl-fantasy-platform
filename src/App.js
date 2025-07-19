import React, { useState } from 'react';
import Layout from './components/common/Layout';
import { useNHLLiveGames } from './hooks/useNHLData';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const { games, loading, error, lastUpdated } = useNHLLiveGames();

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
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="text-center">
            <div className="text-3xl mb-2">👥</div>
            <h4 className="font-semibold text-gray-900">My Team</h4>
            <p className="text-sm text-gray-600">Manage your roster</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="text-center">
            <div className="text-3xl mb-2">🔍</div>
            <h4 className="font-semibold text-gray-900">Find Players</h4>
            <p className="text-sm text-gray-600">Search & analyze</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="text-center">
            <div className="text-3xl mb-2">📊</div>
            <h4 className="font-semibold text-gray-900">Standings</h4>
            <p className="text-sm text-gray-600">League rankings</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="text-center">
            <div className="text-3xl mb-2">⚔️</div>
            <h4 className="font-semibold text-gray-900">Matchups</h4>
            <p className="text-sm text-gray-600">Head-to-head</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Layout title="Dashboard">
      {currentView === 'dashboard' && renderDashboard()}
    </Layout>
  );
}

export default App;
