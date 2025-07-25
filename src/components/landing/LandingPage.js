import React, { useState } from 'react';
import Background from '../common/Background';

const LandingPage = ({ onGetStarted }) => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: "Draft Your Team",
      description: "Experience the most immersive NHL fantasy draft with real-time updates, player rankings, and advanced analytics.",
      icon: "🏒",
      image: "/images/draft-room.jpg", // You'll add these later
      stats: "500K+ drafts completed"
    },
    {
      title: "Manage Your Lineup",
      description: "Set your optimal lineup with our intelligent recommendations and injury alerts. Never miss a game-changing decision.",
      icon: "⚡",
      image: "/images/lineup-manager.jpg",
      stats: "95% lineup optimization"
    },
    {
      title: "Track Live Scores",
      description: "Follow every goal, assist, and save in real-time. Get instant notifications when your players score.",
      icon: "📊",
      image: "/images/live-scores.jpg", 
      stats: "Real-time updates"
    },
    {
      title: "Compete & Win",
      description: "Face off against friends in head-to-head matchups. Climb the leaderboards and prove you're the ultimate hockey GM.",
      icon: "🏆",
      image: "/images/competitions.jpg",
      stats: "Million-dollar prizes"
    }
  ];

  const gameModes = [
    {
      name: "Head-to-Head Categories",
      description: "Battle opponents across 10 statistical categories including goals, assists, saves, and more.",
      popular: true,
      icon: "⚔️",
      features: ["Weekly matchups", "10 categories", "Playoff bracket"]
    },
    {
      name: "Points League", 
      description: "Accumulate points based on player performance with customizable scoring systems.",
      icon: "📈",
      features: ["Custom scoring", "Season-long", "Flexible roster"]
    },
    {
      name: "Dynasty League",
      description: "Build a franchise for the ages with rookie drafts, contracts, and multi-year planning.",
      icon: "🏰",
      features: ["Multi-year", "Rookie drafts", "Salary cap"]
    }
  ];

  return (
    <Background variant="rink">
      <div className="relative">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8">
                <span className="text-blue-600 text-sm font-medium">🏒 The #1 NHL Fantasy Platform</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Fantasy Hockey
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Reimagined
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                The most advanced NHL fantasy platform with real-time drafts, 
                intelligent lineup optimization, and immersive league management.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <button
                  onClick={onGetStarted}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 min-w-[200px]"
                >
                  Start Playing Free
                </button>
                <button className="px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 text-lg font-semibold rounded-xl border border-gray-200 hover:bg-white transition-all duration-200 min-w-[200px]">
                  Watch Demo
                </button>
              </div>

              {/* Social Proof */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 border-2 border-white"></div>
                    ))}
                  </div>
                  <span className="text-sm font-medium">500K+ active managers</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                  <span className="text-sm font-medium">4.9/5 rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-16 h-16 bg-blue-500/10 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-12 h-12 bg-purple-500/10 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-8 h-8 bg-blue-400/20 rounded-full animate-bounce delay-500"></div>
        </section>

        {/* Game Modes Section */}
        <section className="py-24 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Choose Your Game Mode
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                From casual fun to hardcore competition, we have the perfect format for every hockey fan.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {gameModes.map((mode, index) => (
                <div 
                  key={index}
                  className={`relative p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 cursor-pointer ${
                    mode.popular 
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl' 
                      : 'border-gray-200 bg-white/80 hover:border-blue-300'
                  }`}
                >
                  {mode.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center">
                    <div className="text-4xl mb-4">{mode.icon}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{mode.name}</h3>
                    <p className="text-gray-600 mb-6">{mode.description}</p>
                    
                    <ul className="space-y-2 mb-8">
                      {mode.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center justify-center gap-2 text-sm text-gray-700">
                          <span className="text-green-500">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                      mode.popular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>
                      Select Mode
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Showcase */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Everything You Need to Dominate
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Powerful tools and insights to give you the competitive edge in your fantasy leagues.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16">
              {/* Feature Navigation */}
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                      activeFeature === index
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-500 shadow-lg'
                        : 'bg-white/50 border border-gray-200 hover:bg-white/80'
                    }`}
                    onClick={() => setActiveFeature(index)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{feature.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                        <div className="mt-2 text-sm text-blue-600 font-medium">{feature.stats}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Feature Preview */}
              <div className="relative">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 h-96 flex items-center justify-center shadow-xl">
                  <div className="text-6xl opacity-20">{features[activeFeature].icon}</div>
                  {/* Replace with actual screenshots */}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-700">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your Championship Run?
            </h2>
            <p className="text-xl text-blue-100 mb-12">
              Join thousands of hockey fans already dominating their leagues.
            </p>
            <button
              onClick={onGetStarted}
              className="px-12 py-4 bg-white text-blue-600 text-xl font-bold rounded-xl hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-2xl"
            >
              Create Your League Now
            </button>
          </div>
        </section>
      </div>
    </Background>
  );
};

export default LandingPage;