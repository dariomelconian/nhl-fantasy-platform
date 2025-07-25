import React, { useState, useEffect, useMemo } from 'react';
import { useNHLAllPlayers, useNHLPlayerSearch } from '../../hooks/useNHLData';
import { NHL_TEAMS, PLAYER_POSITIONS } from '../../utils/constants';

const PlayerSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  
  const { players, loading, error } = useNHLAllPlayers();
  const { searchPlayers, results: searchResults, loading: searchLoading } = useNHLPlayerSearch();

  // Debounced search
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const timeoutId = setTimeout(() => {
        searchPlayers(searchQuery, 50);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, searchPlayers]);

  // Filter and sort players
  const filteredPlayers = useMemo(() => {
    let filtered = searchQuery.length >= 2 ? searchResults : players;

    if (selectedTeam) {
      filtered = filtered.filter(player => player.team === selectedTeam);
    }

    if (selectedPosition) {
      filtered = filtered.filter(player => player.position === selectedPosition);
    }

    // Sort players
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'team':
          return a.team.localeCompare(b.team);
        case 'position':
          return a.position.localeCompare(b.position);
        default:
          return 0;
      }
    });

    return filtered.slice(0, 100); // Limit to 100 results for performance
  }, [players, searchResults, searchQuery, selectedTeam, selectedPosition, sortBy]);

  const getPositionColor = (position) => {
    switch (position) {
      case 'C': return 'bg-blue-100 text-blue-800';
      case 'LW': return 'bg-green-100 text-green-800';
      case 'RW': return 'bg-purple-100 text-purple-800';
      case 'D': return 'bg-orange-100 text-orange-800';
      case 'G': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTeamColor = (teamAbbrev) => {
    // Use team colors from constants if available
    return 'bg-gray-100 text-gray-800';
  };

  const PlayerCard = ({ player }) => (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 border">
      <div className="flex items-center space-x-3 mb-3">
        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-600">
            {player.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {player.name}
          </h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPositionColor(player.position)}`}>
              {player.position}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getTeamColor(player.team)}`}>
              {player.team}
            </span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
        {player.sweaterNumber && (
          <div>
            <span className="font-medium">#</span> {player.sweaterNumber}
          </div>
        )}
        {player.shoots && (
          <div>
            <span className="font-medium">Shoots:</span> {player.shoots}
          </div>
        )}
        {player.heightInInches && (
          <div>
            <span className="font-medium">Height:</span> {Math.floor(player.heightInInches / 12)}'{player.heightInInches % 12}"
          </div>
        )}
        {player.weightInPounds && (
          <div>
            <span className="font-medium">Weight:</span> {player.weightInPounds} lbs
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        <button className="flex-1 bg-blue-600 text-white text-xs py-2 px-3 rounded hover:bg-blue-700 transition-colors">
          View Stats
        </button>
        <button className="flex-1 bg-green-600 text-white text-xs py-2 px-3 rounded hover:bg-green-700 transition-colors">
          Add to Watch
        </button>
      </div>
    </div>
  );

  const PlayerRow = ({ player }) => (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
            <span className="text-xs font-bold text-gray-600">
              {player.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{player.name}</div>
            <div className="text-xs text-gray-500">#{player.sweaterNumber || 'N/A'}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPositionColor(player.position)}`}>
          {player.position}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTeamColor(player.team)}`}>
          {player.team}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {player.shoots || 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {player.heightInInches ? `${Math.floor(player.heightInInches / 12)}'${player.heightInInches % 12}"` : 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {player.weightInPounds ? `${player.weightInPounds} lbs` : 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-900 text-xs">
            View
          </button>
          <button className="text-green-600 hover:text-green-900 text-xs">
            Watch
          </button>
        </div>
      </td>
    </tr>
  );

  if (loading && !players.length) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Player Search</h1>
        
        {/* Search and Filters */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Players
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Team
            </label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Teams</option>
              {Object.entries(NHL_TEAMS).map(([abbrev, team]) => (
                <option key={abbrev} value={abbrev}>
                  {abbrev} - {team.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position
            </label>
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Positions</option>
              {PLAYER_POSITIONS.ALL.map(position => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="name">Name</option>
              <option value="team">Team</option>
              <option value="position">Position</option>
            </select>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            Showing {filteredPlayers.length} of {searchQuery.length >= 2 ? searchResults.length : players.length} players
            {(searchLoading || loading) && <span className="ml-2">⏳</span>}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 text-sm rounded ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 text-sm rounded ${
                viewMode === 'table'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Table
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-600">Error loading players: {error}</p>
          </div>
        )}

        {/* Results */}
        {viewMode === 'grid' ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredPlayers.map((player, index) => (
              <PlayerCard key={`${player.id || player.name}_${index}`} player={player} />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Player
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shoots
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Height
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Weight
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPlayers.map((player, index) => (
                  <PlayerRow key={`${player.id || player.name}_${index}`} player={player} />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredPlayers.length === 0 && !loading && !searchLoading && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium mb-2">No players found</h3>
            <p className="text-sm">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerSearch;