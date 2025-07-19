import React, { useState, useEffect } from 'react';
import newsApi from '../../services/newsApi';

const PlayerNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch from multiple sources
        const [rotowireNews, espnNews, injuryReport] = await Promise.allSettled([
          newsApi.getRotowireNews(10),
          newsApi.getESPNNews(10),
          newsApi.getInjuryReport()
        ]);

        let allNews = [];
        
        if (rotowireNews.status === 'fulfilled') {
          allNews = [...allNews, ...rotowireNews.value];
        }
        
        if (espnNews.status === 'fulfilled') {
          allNews = [...allNews, ...espnNews.value];
        }
        
        if (injuryReport.status === 'fulfilled') {
          allNews = [...allNews, ...injuryReport.value];
        }

        // If no news from APIs, use mock data
        if (allNews.length === 0) {
          allNews = newsApi.getMockNews();
        }

        // Sort by timestamp and deduplicate
        const sortedNews = newsApi.deduplicateNews(allNews)
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, 15);

        setNews(sortedNews);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news');
        // Fallback to mock data
        setNews(newsApi.getMockNews());
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    
    // Refresh news every 10 minutes
    const interval = setInterval(fetchNews, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredNews = news.filter(item => {
    if (selectedFilter === 'all') return true;
    return item.type === selectedFilter;
  });

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'injury': return '🏥';
      case 'milestone': return '🏆';
      case 'contract': return '💰';
      case 'return': return '↩️';
      case 'performance': return '⭐';
      default: return '📰';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours === 1) return '1 hour ago';
    return `${hours} hours ago`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Player News</h3>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="flex space-x-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
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
          <h3 className="text-lg font-semibold text-gray-900">Player News</h3>
          <button className="text-blue-600 hover:text-blue-500 text-sm font-medium">
            View All
          </button>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex space-x-2 mb-4">
          {['all', 'injury', 'milestone', 'contract', 'return', 'performance'].map(filter => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                selectedFilter === filter
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredNews.map(item => (
            <div key={item.id} className="border-l-4 border-blue-500 pl-4 hover:bg-gray-50 p-2 rounded-r transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">{getTypeIcon(item.type)}</span>
                    <span className="font-medium text-gray-900">{item.player}</span>
                    <span className="text-sm text-gray-500">({item.team})</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getImpactColor(item.impact)}`}>
                      {item.impact} impact
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{item.summary}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{formatTimeAgo(item.timestamp)}</span>
                    <button className="text-xs text-blue-600 hover:text-blue-500 font-medium">
                      Read more
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredNews.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No news found for the selected filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerNews;