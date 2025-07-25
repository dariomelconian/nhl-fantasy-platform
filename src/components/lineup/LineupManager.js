import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LEAGUE_SETTINGS } from '../../config/api';

const LineupManager = () => {
  const [lineup, setLineup] = useState({
    C: [null, null],
    LW: [null, null],
    RW: [null, null],
    D: [null, null, null, null],
    G: [null],
    BN: [null, null, null, null],
    IR: []
  });
  
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Mock roster data
  useEffect(() => {
    const mockRoster = [
      { id: 1, name: "Connor McDavid", position: "C", team: "EDM", status: "active", stats: { G: 45, A: 75, P: 120 } },
      { id: 2, name: "Leon Draisaitl", position: "C", team: "EDM", status: "active", stats: { G: 38, A: 67, P: 105 } },
      { id: 3, name: "David Pastrnak", position: "RW", team: "BOS", status: "active", stats: { G: 52, A: 45, P: 97 } },
      { id: 4, name: "Auston Matthews", position: "C", team: "TOR", status: "injured", stats: { G: 35, A: 32, P: 67 } },
      { id: 5, name: "Erik Karlsson", position: "D", team: "SJS", status: "active", stats: { G: 8, A: 67, P: 75 } },
      { id: 6, name: "Cale Makar", position: "D", team: "COL", status: "active", stats: { G: 12, A: 55, P: 67 } },
      { id: 7, name: "Victor Hedman", position: "D", team: "TBL", status: "active", stats: { G: 7, A: 45, P: 52 } },
      { id: 8, name: "Quinn Hughes", position: "D", team: "VAN", status: "active", stats: { G: 9, A: 48, P: 57 } },
      { id: 9, name: "Igor Shesterkin", position: "G", team: "NYR", status: "active", stats: { W: 28, GAA: 2.45, 'SV%': 0.918 } },
      { id: 10, name: "Frederik Andersen", position: "G", team: "CAR", status: "active", stats: { W: 22, GAA: 2.67, 'SV%': 0.912 } },
      { id: 11, name: "Johnny Gaudreau", position: "LW", team: "CBJ", status: "active", stats: { G: 25, A: 48, P: 73 } },
      { id: 12, name: "Brad Marchand", position: "LW", team: "BOS", status: "active", stats: { G: 28, A: 42, P: 70 } },
      { id: 13, name: "Mikko Rantanen", position: "RW", team: "COL", status: "active", stats: { G: 35, A: 58, P: 93 } },
      { id: 14, name: "Kyle Connor", position: "LW", team: "WPG", status: "active", stats: { G: 42, A: 38, P: 80 } }
    ];

    // Initialize lineup with some players
    const initialLineup = {
      C: [mockRoster[0], mockRoster[1]],
      LW: [mockRoster[10], mockRoster[11]],
      RW: [mockRoster[2], mockRoster[12]],
      D: [mockRoster[4], mockRoster[5], mockRoster[6], mockRoster[7]],
      G: [mockRoster[8]],
      BN: [mockRoster[9], mockRoster[13], null, null],
      IR: mockRoster[3].status === 'injured' ? [mockRoster[3]] : []
    };

    setLineup(initialLineup);
    setAvailablePlayers(mockRoster);
    setLoading(false);
  }, []);

  const getPositionLabel = (position) => {
    const labels = {
      C: 'Center',
      LW: 'Left Wing', 
      RW: 'Right Wing',
      D: 'Defense',
      G: 'Goalie',
      BN: 'Bench',
      IR: 'Injured Reserve'
    };
    return labels[position] || position;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'injured': return 'bg-red-100 text-red-800';
      case 'day-to-day': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const PlayerSlot = ({ position, index, player }) => {
    const isEmpty = !player;
    
    return (
      <div
        className={`border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[100px] flex flex-col justify-center items-center transition-colors hover:border-blue-400 hover:bg-blue-50 cursor-pointer ${
          isEmpty ? 'bg-gray-50' : 'bg-white border-solid border-gray-200'
        }`}
        onClick={() => {
          if (!isEmpty) {
            setSelectedPlayer(player);
          }
        }}
      >
        {isEmpty ? (
          <div className="text-center">
            <div className="text-gray-400 text-2xl mb-1">+</div>
            <div className="text-xs text-gray-500">Add {getPositionLabel(position)}</div>
          </div>
        ) : (
          <div className="text-center w-full">
            <div className="font-medium text-gray-900 text-sm mb-1">{player.name}</div>
            <div className="text-xs text-gray-600 mb-2">{player.team}</div>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(player.status)}`}>
              {player.status}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {position === 'G' ? (
                <>W: {player.stats.W}, GAA: {player.stats.GAA}</>
              ) : (
                <>G: {player.stats.G}, A: {player.stats.A}</>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const PositionGroup = ({ position, players, title }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className={`grid gap-3 ${
        position === 'D' ? 'grid-cols-2 lg:grid-cols-4' : 
        position === 'G' ? 'grid-cols-1' :
        position === 'BN' ? 'grid-cols-2 lg:grid-cols-4' :
        'grid-cols-1 lg:grid-cols-2'
      }`}>
        {players.map((player, index) => (
          <PlayerSlot
            key={`${position}-${index}`}
            position={position}
            index={index}
            player={player}
          />
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid gap-4 lg:grid-cols-2">
              {[1, 2, 3, 4].map(i => (
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
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lineup Manager</h1>
            <p className="text-gray-600 mt-1">Set your active roster for upcoming games</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
              Auto Set
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Save Lineup
            </button>
          </div>
        </div>
      </div>

      {/* Lineup Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Lineup Status</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">8</div>
            <div className="text-sm text-green-700">Active Players</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">4</div>
            <div className="text-sm text-yellow-700">Bench Players</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">1</div>
            <div className="text-sm text-red-700">Injured Players</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">85%</div>
            <div className="text-sm text-blue-700">Lineup Complete</div>
          </div>
        </div>
      </div>

      {/* Active Lineup */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900">Active Lineup</h2>
        
        <div className="grid gap-6 lg:grid-cols-2">
          <PositionGroup position="C" players={lineup.C} title="Centers (2)" />
          <PositionGroup position="G" players={lineup.G} title="Goalies (1)" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <PositionGroup position="LW" players={lineup.LW} title="Left Wings (2)" />
          <PositionGroup position="RW" players={lineup.RW} title="Right Wings (2)" />
        </div>

        <PositionGroup position="D" players={lineup.D} title="Defense (4)" />
      </div>

      {/* Bench and IR */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900">Bench & Reserves</h2>
        
        <div className="grid gap-6 lg:grid-cols-2">
          <PositionGroup position="BN" players={lineup.BN} title="Bench (4)" />
          {lineup.IR.length > 0 && (
            <PositionGroup position="IR" players={lineup.IR} title="Injured Reserve" />
          )}
        </div>
      </div>

      {/* Player Details Modal */}
      {selectedPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{selectedPlayer.name}</h3>
              <button
                onClick={() => setSelectedPlayer(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Position:</span>
                <span className="font-medium">{selectedPlayer.position}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Team:</span>
                <span className="font-medium">{selectedPlayer.team}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedPlayer.status)}`}>
                  {selectedPlayer.status}
                </span>
              </div>
              
              <div className="border-t pt-3">
                <h4 className="font-medium text-gray-900 mb-2">Season Stats</h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  {Object.entries(selectedPlayer.stats).map(([stat, value]) => (
                    <div key={stat} className="text-center">
                      <div className="font-medium text-gray-900">{value}</div>
                      <div className="text-gray-600">{stat}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3">
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                Move to Bench
              </button>
              <button className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors">
                Trade/Drop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LineupManager;