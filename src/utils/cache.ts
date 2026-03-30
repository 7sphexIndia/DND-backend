type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

class MemoryCache {
  private store = new Map<string, CacheEntry<any>>();
  private ttl: number;

  constructor(ttlMinutes: number = 30) {
    this.ttl = ttlMinutes * 60 * 1000;
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.store.delete(key);
      return null;
    }

    return entry.data as T;
  }

  set<T>(key: string, data: T): void {
    this.store.set(key, { data, timestamp: Date.now() });
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

export const apiCache = new MemoryCache();
