import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const LeagueStandings = () => {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeague, setSelectedLeague] = useState('my-league-1');
  const { user } = useAuth();

  // Mock standings data
  useEffect(() => {
    const mockStandings = [
      {
        rank: 1,
        teamName: "Ice Dragons",
        owner: user?.username === "hockey_master" ? "You" : "hockey_master",
        wins: 12,
        losses: 3,
        ties: 1,
        points: 156.8,
        categories: {
          G: 45, A: 67, P: 112, SOG: 289, HIT: 78, BLK: 56,
          W: 8, GAA: 2.34, 'SV%': 0.923, SO: 3
        },
        isUser: user?.username === "hockey_master"
      },
      {
        rank: 2,
        teamName: "Thunder Bolts",
        owner: user?.username === "lightning_fan" ? "You" : "lightning_fan",
        wins: 11,
        losses: 4,
        ties: 1,
        points: 148.3,
        categories: {
          G: 42, A: 63, P: 105, SOG: 276, HIT: 82, BLK: 51,
          W: 7, GAA: 2.45, 'SV%': 0.918, SO: 2
        },
        isUser: user?.username === "lightning_fan"
      },
      {
        rank: 3,
        teamName: "Maple Legends",
        owner: user?.username === "leafs_forever" ? "You" : "leafs_forever",
        wins: 10,
        losses: 5,
        ties: 1,
        points: 142.7,
        categories: {
          G: 39, A: 61, P: 100, SOG: 268, HIT: 75, BLK: 49,
          W: 7, GAA: 2.52, 'SV%': 0.915, SO: 2
        },
        isUser: user?.username === "leafs_forever"
      },
      {
        rank: 4,
        teamName: "Your Fantasy Team",
        owner: "You",
        wins: 9,
        losses: 6,
        ties: 1,
        points: 138.2,
        categories: {
          G: 38, A: 58, P: 96, SOG: 255, HIT: 71, BLK: 47,
          W: 6, GAA: 2.58, 'SV%': 0.912, SO: 1
        },
        isUser: true
      },
      {
        rank: 5,
        teamName: "Boston Bruisers",
        owner: "bruins_fan_99",
        wins: 8,
        losses: 7,
        ties: 1,
        points: 134.9,
        categories: {
          G: 36, A: 55, P: 91, SOG: 248, HIT: 85, BLK: 52,
          W: 6, GAA: 2.65, 'SV%': 0.909, SO: 1
        },
        isUser: false
      },
      {
        rank: 6,
        teamName: "Rangers Republic",
        owner: "ny_rangers_1994",
        wins: 7,
        losses: 8,
        ties: 1,
        points: 128.5,
        categories: {
          G: 34, A: 52, P: 86, SOG: 241, HIT: 69, BLK: 44,
          W: 5, GAA: 2.72, 'SV%': 0.906, SO: 0
        },
        isUser: false
      }
    ];

    setTimeout(() => {
      setStandings(mockStandings);
      setLoading(false);
    }, 1000);
  }, [user]);

  const getPositionChange = (rank) => {
    // Mock position changes
    const changes = {1: 0, 2: 1, 3: -1, 4: 2, 5: -1, 6: 0};
    return changes[rank] || 0;
  };

  const getPositionIcon = (change) => {
    if (change > 0) return <span className="text-green-600">↗️</span>;
    if (change < 0) return <span className="text-red-600">↘️</span>;
    return <span className="text-gray-400">→</span>;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">League Standings</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="animate-pulse flex space-x-4">
              <div className="h-4 bg-gray-200 rounded w-8"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">League Standings</h3>
          <select 
            value={selectedLeague}
            onChange={(e) => setSelectedLeague(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="my-league-1">NHL Fantasy Masters</option>
            <option value="my-league-2">Office Hockey League</option>
            <option value="my-league-3">Friends & Family</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Team
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Record
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Points
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categories
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {standings.map((team) => (
              <tr 
                key={team.rank} 
                className={`hover:bg-gray-50 ${team.isUser ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${team.isUser ? 'text-blue-900' : 'text-gray-900'}`}>
                      #{team.rank}
                    </span>
                    {getPositionIcon(getPositionChange(team.rank))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className={`text-sm font-medium ${team.isUser ? 'text-blue-900' : 'text-gray-900'}`}>
                      {team.teamName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {team.owner}
                      {team.isUser && <span className="ml-1 text-blue-600 font-medium">(You)</span>}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {team.wins}-{team.losses}-{team.ties}
                  </div>
                  <div className="text-sm text-gray-500">
                    {((team.wins + team.ties * 0.5) / (team.wins + team.losses + team.ties) * 100).toFixed(1)}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${team.isUser ? 'text-blue-900' : 'text-gray-900'}`}>
                    {team.points}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="grid grid-cols-5 gap-2 text-xs">
                    <div className="text-center">
                      <div className="font-medium">G</div>
                      <div className="text-gray-600">{team.categories.G}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">A</div>
                      <div className="text-gray-600">{team.categories.A}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">SOG</div>
                      <div className="text-gray-600">{team.categories.SOG}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">W</div>
                      <div className="text-gray-600">{team.categories.W}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">SV%</div>
                      <div className="text-gray-600">{team.categories['SV%']}</div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-gray-50 border-t">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Updated 2 hours ago</span>
          <button className="text-blue-600 hover:text-blue-500 font-medium">
            View Full Standings
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeagueStandings;