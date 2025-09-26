import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private preferencesSubject = new BehaviorSubject<any>(null);
  public preferences$ = this.preferencesSubject.asObservable();

  // Legacy methods for backwards compatibility
  set<T>(key: string, value: T, session = false) {
    const s = session ? sessionStorage : localStorage;
    s.setItem(key, JSON.stringify(value));
  }
  
  get<T>(key: string, session = false): T | null {
    const s = session ? sessionStorage : localStorage;
    const raw = s.getItem(key);
    return raw ? JSON.parse(raw) as T : null;
  }
  
  remove(key: string, session = false) {
    const s = session ? sessionStorage : localStorage;
    s.removeItem(key);
  }

  // New enhanced methods with better error handling
  setItem(key: string, value: any, session = false): boolean {
    try {
      const storage = session ? sessionStorage : localStorage;
      const serialized = JSON.stringify(value);
      storage.setItem(key, serialized);
      
      // Notify subscribers if this is preferences
      if (key === 'userPreferences') {
        this.preferencesSubject.next(value);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to save to storage:', error);
      return false;
    }
  }

  getItem<T>(key: string, defaultValue: T, session = false): T {
    try {
      const storage = session ? sessionStorage : localStorage;
      const item = storage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Failed to load from storage:', error);
      return defaultValue;
    }
  }

  removeItem(key: string, session = false): void {
    try {
      const storage = session ? sessionStorage : localStorage;
      storage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from storage:', error);
    }
  }

  clear(session = false): void {
    try {
      const storage = session ? sessionStorage : localStorage;
      storage.clear();
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }

  // Storage with expiration
  setWithExpiry(key: string, value: any, ttl: number, session = false) {
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + ttl
    };
    this.setItem(key, item, session);
  }

  getWithExpiry<T>(key: string, session = false): T | null {
    const storage = session ? sessionStorage : localStorage;
    const itemStr = storage.getItem(key);
    if (!itemStr) return null;

    try {
      const item = JSON.parse(itemStr);
      const now = new Date();
      
      if (now.getTime() > item.expiry) {
        this.removeItem(key, session);
        return null;
      }
      return item.value;
    } catch {
      return null;
    }
  }

  // Storage usage analytics
  getStorageStats(session = false) {
    const storage = session ? sessionStorage : localStorage;
    let totalSize = 0;
    const keys = Object.keys(storage);
    
    const stats = keys.map(key => {
      const size = storage.getItem(key)?.length || 0;
      totalSize += size;
      return { key, size };
    });

    return {
      totalKeys: keys.length,
      totalSize,
      usage: stats.sort((a, b) => b.size - a.size)
    };
  }
}
