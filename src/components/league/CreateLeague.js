import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LEAGUE_SETTINGS, FANTASY_CATEGORIES } from '../../config/api';

const CreateLeague = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    maxTeams: 8,
    draftDate: '',
    draftTime: '19:00',
    entryFee: 0,
    isPublic: true,
    password: '',
    categories: [...FANTASY_CATEGORIES.SKATER.map(c => c.key), ...FANTASY_CATEGORIES.GOALIE.map(c => c.key)],
    draftType: 'snake',
    lineupPositions: {
      C: 2,
      LW: 2, 
      RW: 2,
      D: 4,
      G: 1,
      BN: 4,
      IR: 2
    },
    scoring: {
      G: 6,
      A: 4,
      P: 1,
      SOG: 0.5,
      HIT: 0.3,
      BLK: 0.3,
      W: 5,
      GAA: -2,
      'SV%': 0.2,
      SO: 3
    }
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(false);
  const [leagueCode, setLeagueCode] = useState('');
  const { user } = useAuth();

  const generateLeagueCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleCategoryToggle = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleSubmit = async () => {
    setCreating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const generatedCode = generateLeagueCode();
    setLeagueCode(generatedCode);
    setCreated(true);
    setCreating(false);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  if (created) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">League Created Successfully!</h2>
          <p className="text-gray-600 mb-6">Your fantasy hockey league has been created and is ready for teams to join.</p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">League Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">League Name:</span>
                <span className="font-medium text-blue-900">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">League Code:</span>
                <span className="font-mono font-bold text-blue-900 text-lg">{leagueCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Max Teams:</span>
                <span className="font-medium text-blue-900">{formData.maxTeams}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Draft Date:</span>
                <span className="font-medium text-blue-900">
                  {new Date(formData.draftDate + 'T' + formData.draftTime).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium">
              Go to League Dashboard
            </button>
            <button className="w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors font-medium">
              Invite Friends
            </button>
            <button className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors">
              Create Another League
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow">
        {/* Progress Bar */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map(step => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Step {currentStep} of 4: {
              ['Basic Information', 'Draft Settings', 'Scoring & Categories', 'Review & Create'][currentStep - 1]
            }
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Basic League Information</h2>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    League Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Enter league name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Teams
                  </label>
                  <select
                    value={formData.maxTeams}
                    onChange={(e) => handleChange('maxTeams', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Array.from({length: 11}, (_, i) => i + 4).map(num => (
                      <option key={num} value={num}>{num} Teams</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  League Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe your league..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Entry Fee ($)
                  </label>
                  <input
                    type="number"
                    value={formData.entryFee}
                    onChange={(e) => handleChange('entryFee', parseFloat(e.target.value) || 0)}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    League Privacy
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={formData.isPublic}
                        onChange={() => handleChange('isPublic', true)}
                        className="mr-2"
                      />
                      Public (anyone can join)
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={!formData.isPublic}
                        onChange={() => handleChange('isPublic', false)}
                        className="mr-2"
                      />
                      Private (invite only)
                    </label>
                  </div>
                </div>
              </div>

              {!formData.isPublic && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    League Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="Set league password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 2: Draft Settings */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Draft Settings</h2>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Draft Date *
                  </label>
                  <input
                    type="date"
                    value={formData.draftDate}
                    onChange={(e) => handleChange('draftDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Draft Time
                  </label>
                  <input
                    type="time"
                    value={formData.draftTime}
                    onChange={(e) => handleChange('draftTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Draft Type
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={formData.draftType === 'snake'}
                      onChange={() => handleChange('draftType', 'snake')}
                      className="mr-2"
                    />
                    Snake Draft (recommended)
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={formData.draftType === 'linear'}
                      onChange={() => handleChange('draftType', 'linear')}
                      className="mr-2"
                    />
                    Linear Draft
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Roster Positions</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {Object.entries(LEAGUE_SETTINGS.POSITIONS).map(([pos, info]) => (
                    <div key={pos}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {info.name}
                      </label>
                      <input
                        type="number"
                        value={formData.lineupPositions[pos]}
                        onChange={(e) => handleNestedChange('lineupPositions', pos, parseInt(e.target.value) || 0)}
                        min={info.min}
                        max={info.max}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Scoring & Categories */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Scoring & Categories</h2>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Skater Categories</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {FANTASY_CATEGORIES.SKATER.map(category => (
                    <label key={category.key} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.categories.includes(category.key)}
                        onChange={() => handleCategoryToggle(category.key)}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="text-sm font-medium text-gray-700">{category.name} ({category.abbrev})</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Goalie Categories</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {FANTASY_CATEGORIES.GOALIE.map(category => (
                    <label key={category.key} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.categories.includes(category.key)}
                        onChange={() => handleCategoryToggle(category.key)}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="text-sm font-medium text-gray-700">{category.name} ({category.abbrev})</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Point Values</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(formData.scoring).map(([stat, points]) => (
                    <div key={stat}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {stat}
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={points}
                        onChange={(e) => handleNestedChange('scoring', stat, parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Review & Create League</h2>
              
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="font-medium text-gray-900">League Name</h3>
                    <p className="text-gray-600">{formData.name}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Teams</h3>
                    <p className="text-gray-600">{formData.maxTeams} teams</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Entry Fee</h3>
                    <p className="text-gray-600">${formData.entryFee}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Privacy</h3>
                    <p className="text-gray-600">{formData.isPublic ? 'Public' : 'Private'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Draft</h3>
                    <p className="text-gray-600">
                      {new Date(formData.draftDate + 'T' + formData.draftTime).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Categories</h3>
                    <p className="text-gray-600">{formData.categories.length} categories</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Ready to Create?</h4>
                <p className="text-sm text-blue-700">
                  Once created, you'll receive a unique league code that you can share with friends to join your league.
                  You can always modify league settings before the draft begins.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="px-6 py-4 bg-gray-50 flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {currentStep < 4 ? (
            <button
              onClick={nextStep}
              disabled={currentStep === 1 && !formData.name}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={creating}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {creating ? 'Creating League...' : 'Create League'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateLeague;