import { CACHE_DURATION, CACHE_KEYS } from '../config/api';

class CacheManager {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
    this.cleanup();
  }

  set(key, data, duration = CACHE_DURATION.MEDIUM) {
    this.cache.set(key, data);
    this.timestamps.set(key, {
      created: Date.now(),
      duration: duration
    });
  }

  get(key) {
    if (!this.cache.has(key)) {
      return null;
    }

    const timestamp = this.timestamps.get(key);
    if (!timestamp) {
      this.cache.delete(key);
      return null;
    }

    const now = Date.now();
    const age = now - timestamp.created;

    if (age > timestamp.duration) {
      this.cache.delete(key);
      this.timestamps.delete(key);
      return null;
    }

    return this.cache.get(key);
  }

  has(key) {
    return this.get(key) !== null;
  }

  delete(key) {
    this.cache.delete(key);
    this.timestamps.delete(key);
  }

  clear() {
    this.cache.clear();
    this.timestamps.clear();
  }

  getSize() {
    return this.cache.size;
  }

  getKeys() {
    return Array.from(this.cache.keys());
  }

  getCacheInfo(key) {
    const timestamp = this.timestamps.get(key);
    if (!timestamp) return null;

    const now = Date.now();
    const age = now - timestamp.created;
    const remaining = Math.max(0, timestamp.duration - age);

    return {
      key,
      created: new Date(timestamp.created),
      age: Math.floor(age / 1000),
      remaining: Math.floor(remaining / 1000),
      duration: Math.floor(timestamp.duration / 1000),
      expired: remaining <= 0
    };
  }

  getAllCacheInfo() {
    return this.getKeys().map(key => this.getCacheInfo(key)).filter(Boolean);
  }

  cleanup() {
    setInterval(() => {
      const now = Date.now();
      const keysToDelete = [];

      this.timestamps.forEach((timestamp, key) => {
        const age = now - timestamp.created;
        if (age > timestamp.duration) {
          keysToDelete.push(key);
        }
      });

      keysToDelete.forEach(key => {
        this.cache.delete(key);
        this.timestamps.delete(key);
      });

      if (keysToDelete.length > 0) {
        console.log(`Cache cleanup: removed ${keysToDelete.length} expired entries`);
      }
    }, 60000);
  }

  async getOrFetch(key, fetchFunction, duration = CACHE_DURATION.MEDIUM) {
    const cached = this.get(key);
    if (cached !== null) {
      return cached;
    }

    try {
      const data = await fetchFunction();
      this.set(key, data, duration);
      return data;
    } catch (error) {
      console.error(`Failed to fetch data for key ${key}:`, error);
      throw error;
    }
  }

  invalidatePattern(pattern) {
    const regex = new RegExp(pattern);
    const keysToDelete = this.getKeys().filter(key => regex.test(key));
    keysToDelete.forEach(key => this.delete(key));
    return keysToDelete.length;
  }

  getStats() {
    const all = this.getAllCacheInfo();
    const expired = all.filter(info => info.expired);
    const valid = all.filter(info => !info.expired);

    return {
      total: all.length,
      valid: valid.length,
      expired: expired.length,
      memoryUsage: this.getApproximateMemoryUsage()
    };
  }

  getApproximateMemoryUsage() {
    let size = 0;
    this.cache.forEach((value, key) => {
      size += new Blob([JSON.stringify(value) + key]).size;
    });
    return Math.round(size / 1024);
  }
}

export default new CacheManager();