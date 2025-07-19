import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const JoinLeague = () => {
  const [activeTab, setActiveTab] = useState('public');
  const [publicLeagues, setPublicLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joinCode, setJoinCode] = useState('');
  const [joinPassword, setJoinPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    // Mock public leagues data
    const mockPublicLeagues = [
      {
        id: 'league_001',
        name: 'NHL Fantasy Masters',
        description: 'Competitive league for experienced fantasy players',
        teams: 8,
        maxTeams: 12,
        draftDate: '2024-10-15T19:00:00Z',
        entryFee: 0,
        categories: ['G', 'A', 'P', 'SOG', 'HIT', 'BLK', 'W', 'GAA', 'SV%', 'SO'],
        commissionerName: 'FantasyPro92',
        isPasswordProtected: false,
        difficulty: 'Expert',
        status: 'open'
      },
      {
        id: 'league_002',
        name: 'Casual Hockey Friends',
        description: 'Fun league for friends and family',
        teams: 6,
        maxTeams: 10,
        draftDate: '2024-10-18T20:00:00Z',
        entryFee: 0,
        categories: ['G', 'A', 'P', 'W', 'GAA', 'SV%'],
        commissionerName: 'HockeyDad2024',
        isPasswordProtected: false,
        difficulty: 'Beginner',
        status: 'open'
      },
      {
        id: 'league_003',
        name: 'Office Hockey Pool',
        description: 'Workplace fantasy league with weekly prizes',
        teams: 12,
        maxTeams: 14,
        draftDate: '2024-10-20T18:30:00Z',
        entryFee: 25,
        categories: ['G', 'A', 'P', 'SOG', 'HIT', 'BLK', 'W', 'GAA', 'SV%', 'SO'],
        commissionerName: 'OfficeManager',
        isPasswordProtected: true,
        difficulty: 'Intermediate',
        status: 'open'
      },
      {
        id: 'league_004',
        name: 'High Stakes Championship',
        description: 'Premium league with $500 entry fee',
        teams: 10,
        maxTeams: 12,
        draftDate: '2024-10-22T19:00:00Z',
        entryFee: 500,
        categories: ['G', 'A', 'P', 'SOG', 'HIT', 'BLK', 'W', 'GAA', 'SV%', 'SO'],
        commissionerName: 'ProFantasy',
        isPasswordProtected: false,
        difficulty: 'Expert',
        status: 'open'
      },
      {
        id: 'league_005',
        name: 'College Alumni League',
        description: 'University alumni fantasy hockey',
        teams: 8,
        maxTeams: 8,
        draftDate: '2024-10-16T21:00:00Z',
        entryFee: 50,
        categories: ['G', 'A', 'P', 'W', 'GAA', 'SV%'],
        commissionerName: 'AlumniPres',
        isPasswordProtected: false,
        difficulty: 'Intermediate',
        status: 'full'
      }
    ];

    setTimeout(() => {
      setPublicLeagues(mockPublicLeagues);
      setLoading(false);
    }, 1000);
  }, []);

  const handleJoinPublicLeague = async (leagueId) => {
    try {
      setError('');
      setSuccess('');
      
      // TODO: Implement actual league joining API call
      console.log(`Joining league ${leagueId} for user ${user?.username}`);
      
      // Mock success
      setSuccess('Successfully joined the league! You will be redirected to the draft room.');
      
      // In a real app, you would:
      // 1. Make API call to join league
      // 2. Update user's leagues list
      // 3. Redirect to league dashboard
      
    } catch (err) {
      setError('Failed to join league. Please try again.');
    }
  };

  const handleJoinPrivateLeague = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!joinCode.trim()) {
      setError('Please enter a league code');
      return;
    }

    try {
      // TODO: Implement private league joining API call
      console.log(`Joining private league with code: ${joinCode}, password: ${joinPassword}`);
      
      // Mock validation
      if (joinCode === 'DEMO123') {
        setSuccess('Successfully joined the private league!');
        setJoinCode('');
        setJoinPassword('');
      } else {
        setError('Invalid league code or password');
      }
      
    } catch (err) {
      setError('Failed to join league. Please check your code and password.');
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDraftDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Join a Fantasy League</h1>
        <p className="text-gray-600 mb-6">
          Find and join fantasy hockey leagues or enter a private league with a code.
        </p>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('public')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'public'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Public Leagues
            </button>
            <button
              onClick={() => setActiveTab('private')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'private'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Join with Code
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'create'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Create League
            </button>
          </nav>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Public Leagues Tab */}
        {activeTab === 'public' && (
          <div>
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Available Public Leagues</h3>
              <div className="flex space-x-2">
                <select className="text-sm border border-gray-300 rounded-md px-3 py-1">
                  <option>All Difficulties</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Expert</option>
                </select>
                <select className="text-sm border border-gray-300 rounded-md px-3 py-1">
                  <option>All Entry Fees</option>
                  <option>Free</option>
                  <option>$1-$50</option>
                  <option>$50+</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse bg-gray-100 rounded-lg h-32"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {publicLeagues.map(league => (
                  <div key={league.id} className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">{league.name}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(league.difficulty)}`}>
                            {league.difficulty}
                          </span>
                          {league.isPasswordProtected && (
                            <span className="text-gray-400">🔒</span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-3">{league.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Teams:</span>
                            <span className="ml-1 font-medium">{league.teams}/{league.maxTeams}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Entry Fee:</span>
                            <span className="ml-1 font-medium">${league.entryFee}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Draft:</span>
                            <span className="ml-1 font-medium">{formatDraftDate(league.draftDate)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Commissioner:</span>
                            <span className="ml-1 font-medium">{league.commissionerName}</span>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <span className="text-gray-500 text-sm">Categories: </span>
                          <span className="text-sm">{league.categories.join(', ')}</span>
                        </div>
                      </div>
                      
                      <div className="ml-6">
                        {league.status === 'full' ? (
                          <button disabled className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed">
                            League Full
                          </button>
                        ) : (
                          <button
                            onClick={() => handleJoinPublicLeague(league.id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Join League
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Private League Tab */}
        {activeTab === 'private' && (
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Join Private League</h3>
            <form onSubmit={handleJoinPrivateLeague} className="space-y-4">
              <div>
                <label htmlFor="joinCode" className="block text-sm font-medium text-gray-700 mb-1">
                  League Code *
                </label>
                <input
                  id="joinCode"
                  type="text"
                  required
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="Enter league code (e.g., DEMO123)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="joinPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  League Password (if required)
                </label>
                <input
                  id="joinPassword"
                  type="password"
                  value={joinPassword}
                  onChange={(e) => setJoinPassword(e.target.value)}
                  placeholder="Enter password if required"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Join Private League
              </button>
            </form>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h4 className="font-medium text-gray-900 mb-2">Demo Code</h4>
              <p className="text-sm text-gray-600">
                Try using code <code className="bg-gray-200 px-1 rounded">DEMO123</code> to test joining a private league.
              </p>
            </div>
          </div>
        )}

        {/* Create League Tab */}
        {activeTab === 'create' && (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create Your Own League</h3>
            <p className="text-gray-600 mb-6">
              Set up a custom fantasy hockey league with your own rules and invite friends.
            </p>
            <button className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium">
              Create New League
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinLeague;