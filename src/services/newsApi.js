import axios from 'axios';

class NewsApiService {
  constructor() {
    this.sources = {
      rotowire: {
        baseURL: 'https://api.rotowire.com/v1',
        endpoints: {
          nhl_news: '/nhl/news',
          player_news: '/nhl/players/{playerId}/news',
          injury_report: '/nhl/injuries'
        }
      },
      sportsnet: {
        baseURL: 'https://api.sportsnet.ca/v1',
        endpoints: {
          nhl_news: '/nhl/news',
          breaking_news: '/nhl/breaking'
        }
      },
      espn: {
        baseURL: 'https://site.api.espn.com/apis/site/v2/sports/hockey/nhl',
        endpoints: {
          news: '/news',
          player_news: '/athletes/{playerId}/news'
        }
      },
      yahoo: {
        baseURL: 'https://api.sports.yahoo.com/v1',
        endpoints: {
          nhl_news: '/nhl/news',
          player_news: '/nhl/players/{playerId}/news'
        }
      }
    };

    this.client = axios.create({
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async getRotowireNews(limit = 20) {
    try {
      // Note: You'll need to sign up for Rotowire API access
      const response = await this.client.get(`${this.sources.rotowire.baseURL}/nhl/news`, {
        params: {
          limit,
          sport: 'nhl'
        },
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_ROTOWIRE_API_KEY}`
        }
      });
      
      return this.formatRotowireNews(response.data);
    } catch (error) {
      console.error('Rotowire API error:', error);
      return this.getMockNews(); // Fallback to mock data
    }
  }

  async getESPNNews(limit = 20) {
    try {
      const response = await this.client.get(`${this.sources.espn.baseURL}/news`, {
        params: { limit }
      });
      
      return this.formatESPNNews(response.data);
    } catch (error) {
      console.error('ESPN API error:', error);
      return this.getMockNews();
    }
  }

  async getPlayerNews(playerId, playerName) {
    try {
      // Try multiple sources for player-specific news
      const sources = await Promise.allSettled([
        this.getRotowirePlayerNews(playerId),
        this.getESPNPlayerNews(playerId),
        this.searchNewsForPlayer(playerName)
      ]);

      const allNews = sources
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value)
        .flat();

      return this.deduplicateNews(allNews);
    } catch (error) {
      console.error('Player news fetch error:', error);
      return [];
    }
  }

  async getRotowirePlayerNews(playerId) {
    try {
      const response = await this.client.get(
        `${this.sources.rotowire.baseURL}/nhl/players/${playerId}/news`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_ROTOWIRE_API_KEY}`
          }
        }
      );
      
      return this.formatRotowireNews(response.data);
    } catch (error) {
      console.error('Rotowire player news error:', error);
      return [];
    }
  }

  async getESPNPlayerNews(playerId) {
    try {
      const response = await this.client.get(
        `${this.sources.espn.baseURL}/athletes/${playerId}/news`
      );
      
      return this.formatESPNNews(response.data);
    } catch (error) {
      console.error('ESPN player news error:', error);
      return [];
    }
  }

  async searchNewsForPlayer(playerName) {
    try {
      // Use NewsAPI.org for general hockey news search
      const response = await this.client.get('https://newsapi.org/v2/everything', {
        params: {
          q: `"${playerName}" AND (NHL OR hockey)`,
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 10
        },
        headers: {
          'X-API-Key': process.env.REACT_APP_NEWS_API_KEY
        }
      });
      
      return this.formatNewsAPIResults(response.data.articles, playerName);
    } catch (error) {
      console.error('NewsAPI search error:', error);
      return [];
    }
  }

  async getInjuryReport() {
    try {
      const response = await this.client.get(`${this.sources.rotowire.baseURL}/nhl/injuries`, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_ROTOWIRE_API_KEY}`
        }
      });
      
      return this.formatInjuryReport(response.data);
    } catch (error) {
      console.error('Injury report error:', error);
      return [];
    }
  }

  formatRotowireNews(data) {
    if (!data || !data.news) return [];
    
    return data.news.map(item => ({
      id: `rotowire_${item.id}`,
      title: item.headline,
      summary: item.summary,
      content: item.analysis,
      player: item.player?.name,
      playerId: item.player?.id,
      team: item.player?.team,
      type: this.classifyNewsType(item.headline, item.summary),
      impact: this.assessFantasyImpact(item.impact_rating),
      timestamp: new Date(item.timestamp),
      source: 'Rotowire',
      url: item.url,
      imageUrl: item.player?.headshot_url
    }));
  }

  formatESPNNews(data) {
    if (!data || !data.articles) return [];
    
    return data.articles.map(item => ({
      id: `espn_${item.id}`,
      title: item.headline,
      summary: item.description,
      content: item.story,
      player: this.extractPlayerFromESPN(item),
      team: this.extractTeamFromESPN(item),
      type: this.classifyNewsType(item.headline, item.description),
      impact: this.assessFantasyImpact(item.categories),
      timestamp: new Date(item.published),
      source: 'ESPN',
      url: item.links?.web?.href,
      imageUrl: item.images?.[0]?.url
    }));
  }

  formatNewsAPIResults(articles, playerName) {
    return articles.map(article => ({
      id: `newsapi_${article.url.split('/').pop()}`,
      title: article.title,
      summary: article.description,
      content: article.content,
      player: playerName,
      team: this.extractTeamFromText(article.title + ' ' + article.description),
      type: this.classifyNewsType(article.title, article.description),
      impact: this.assessFantasyImpact(article.title),
      timestamp: new Date(article.publishedAt),
      source: article.source.name,
      url: article.url,
      imageUrl: article.urlToImage
    }));
  }

  formatInjuryReport(data) {
    if (!data || !data.injuries) return [];
    
    return data.injuries.map(injury => ({
      id: `injury_${injury.player_id}`,
      title: `${injury.player_name} - ${injury.injury_status}`,
      summary: injury.injury_details,
      player: injury.player_name,
      playerId: injury.player_id,
      team: injury.team,
      type: 'injury',
      impact: injury.severity === 'severe' ? 'high' : injury.severity === 'moderate' ? 'medium' : 'low',
      timestamp: new Date(injury.last_updated),
      source: 'Rotowire Injury Report',
      injuryType: injury.injury_type,
      expectedReturn: injury.expected_return
    }));
  }

  classifyNewsType(headline, summary) {
    const text = (headline + ' ' + summary).toLowerCase();
    
    if (text.includes('injur') || text.includes('hurt') || text.includes('ir ') || text.includes('injured reserve')) {
      return 'injury';
    }
    if (text.includes('return') || text.includes('back') || text.includes('activated')) {
      return 'return';
    }
    if (text.includes('trade') || text.includes('sign') || text.includes('contract') || text.includes('extension')) {
      return 'contract';
    }
    if (text.includes('goal') || text.includes('assist') || text.includes('hat trick') || text.includes('record')) {
      return 'performance';
    }
    if (text.includes('milestone') || text.includes('100') || text.includes('career')) {
      return 'milestone';
    }
    
    return 'general';
  }

  assessFantasyImpact(indicator) {
    if (typeof indicator === 'string') {
      const text = indicator.toLowerCase();
      if (text.includes('high') || text.includes('major') || text.includes('significant')) return 'high';
      if (text.includes('medium') || text.includes('moderate')) return 'medium';
      return 'low';
    }
    
    if (typeof indicator === 'number') {
      if (indicator >= 8) return 'high';
      if (indicator >= 5) return 'medium';
      return 'low';
    }
    
    return 'medium';
  }

  extractPlayerFromESPN(item) {
    // ESPN API usually includes athlete data
    return item.athletes?.[0]?.displayName || null;
  }

  extractTeamFromESPN(item) {
    return item.team?.abbreviation || null;
  }

  extractTeamFromText(text) {
    const teams = ['ANA', 'BOS', 'BUF', 'CAR', 'CBJ', 'CGY', 'CHI', 'COL', 'DAL', 'DET', 'EDM', 'FLA', 'LAK', 'MIN', 'MTL', 'NJD', 'NSH', 'NYI', 'NYR', 'OTT', 'PHI', 'PIT', 'SEA', 'SJS', 'STL', 'TBL', 'TOR', 'UTA', 'VAN', 'VGK', 'WPG', 'WSH'];
    
    for (const team of teams) {
      if (text.includes(team)) return team;
    }
    
    return null;
  }

  deduplicateNews(newsArray) {
    const seen = new Set();
    return newsArray.filter(item => {
      const key = `${item.player}_${item.title.substring(0, 20)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  getMockNews() {
    // Fallback mock data when APIs are unavailable
    return [
      {
        id: 'mock_1',
        title: "Connor McDavid reaches 100 points for fourth time",
        summary: "Edmonton captain becomes fastest to 100 points this season with assist in 5-2 win over Vancouver",
        player: "Connor McDavid",
        team: "EDM",
        type: "milestone",
        impact: "high",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        source: "NHL.com"
      },
      {
        id: 'mock_2',
        title: "Auston Matthews placed on IR with upper-body injury",
        summary: "Toronto star expected to miss 2-3 weeks with upper-body injury sustained in practice",
        player: "Auston Matthews",
        team: "TOR",
        type: "injury",
        impact: "high",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        source: "TSN"
      }
    ];
  }
}

export default new NewsApiService();