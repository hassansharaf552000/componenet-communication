import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StorageService } from './storage.service';
import { 
  LearningNotesComponent, 
  LearningNote,
  CodeExamplesComponent, 
  CodeExample,
  ExplanationSectionComponent, 
  ExplanationSection,
  ProsConsSectionComponent, 
  ProsConsData 
} from '../../shared';

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: boolean;
  autoSave: boolean;
  pageSize: number;
  lastLogin?: string;
}

interface AppState {
  currentPage: string;
  searchQuery: string;
  filters: string[];
  selectedItems: number[];
  viewMode: 'grid' | 'list';
}

@Component({
  selector: 'app-storage-page',
  standalone: true,
  imports: [
    FormsModule, 
    CommonModule,
    LearningNotesComponent,
    CodeExamplesComponent,
    ExplanationSectionComponent,
    ProsConsSectionComponent
  ],
  templateUrl: './storage.page.html',
  styleUrls: ['./storage.page.css']
})
export class StoragePageComponent implements OnInit {
  preferences: UserPreferences = {
    theme: 'light',
    language: 'en',
    notifications: true,
    autoSave: false,
    pageSize: 20
  };

  sessionState: AppState = {
    currentPage: 'dashboard',
    searchQuery: '',
    filters: [],
    selectedItems: [],
    viewMode: 'grid'
  };

  lastUpdated: Date = new Date();

  constructor(private storageService: StorageService) {}

  ngOnInit() {
    this.loadPreferences();
    this.loadSessionState();
  }

  // Learning notes data
  learningNotes: LearningNote[] = [
    {
      title: 'localStorage vs sessionStorage',
      content: 'localStorage persists until explicitly cleared, sessionStorage only lasts for the browser session.',
      type: 'tip'
    },
    {
      title: 'Storage Events',
      content: 'Use storage events to listen for changes across tabs and windows for real-time synchronization.',
      type: 'info'
    },
    {
      title: 'Storage Limits',
      content: 'Browser storage has size limits (usually 5-10MB). Always handle quota exceeded errors gracefully.',
      type: 'warning'
    },
    {
      title: 'JSON Serialization',
      content: 'Storage APIs only store strings. Use JSON.stringify/parse for complex objects.',
      type: 'tip'
    }
  ];

  // Code examples data
  codeExamples: CodeExample[] = [
    {
      title: 'Storage Service Implementation',
      language: 'TypeScript',
      code: `import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private preferencesSubject = new BehaviorSubject<any>(null);
  public preferences$ = this.preferencesSubject.asObservable();

  // Save to localStorage with error handling
  setItem(key: string, value: any): boolean {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      return false;
    }
  }

  // Load from localStorage with type safety
  getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return defaultValue;
    }
  }

  // Remove item from storage
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  }

  // Clear all localStorage
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }
}`,
      explanation: 'Complete storage service with error handling, type safety, and reactive patterns.'
    },
    {
      title: 'Component Storage Integration',
      language: 'TypeScript',
      code: `export class PreferencesComponent implements OnInit {
  preferences: UserPreferences = defaultPreferences;

  constructor(private storageService: StorageService) {}

  ngOnInit() {
    // Load preferences on component init
    this.loadPreferences();
    
    // Listen for storage changes from other tabs
    window.addEventListener('storage', this.onStorageChange.bind(this));
  }

  savePreferences() {
    const success = this.storageService.setItem('userPreferences', this.preferences);
    if (success) {
      this.preferences.lastLogin = new Date().toISOString();
      console.log('Preferences saved successfully');
    }
  }

  loadPreferences() {
    this.preferences = this.storageService.getItem('userPreferences', defaultPreferences);
  }

  private onStorageChange(event: StorageEvent) {
    if (event.key === 'userPreferences' && event.newValue) {
      try {
        this.preferences = JSON.parse(event.newValue);
        console.log('Preferences updated from another tab');
      } catch (error) {
        console.error('Failed to parse updated preferences');
      }
    }
  }

  ngOnDestroy() {
    window.removeEventListener('storage', this.onStorageChange.bind(this));
  }
}`,
      explanation: 'Component integration with storage service and cross-tab synchronization.'
    },
    {
      title: 'Session Storage for Temporary State',
      language: 'TypeScript',
      code: `export class SessionStateComponent {
  private readonly SESSION_KEY = 'appSessionState';

  saveSessionState(state: AppState) {
    try {
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(state));
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.warn('Session storage quota exceeded');
        this.clearOldSessions();
      }
    }
  }

  loadSessionState(): AppState | null {
    try {
      const stored = sessionStorage.getItem(this.SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to load session state:', error);
      return null;
    }
  }

  // Auto-save session state on changes
  autoSaveState = debounce((state: AppState) => {
    this.saveSessionState(state);
  }, 500);

  private clearOldSessions() {
    // Clean up old session data
    const keysToRemove = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key?.startsWith('old_session_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => sessionStorage.removeItem(key));
  }
}`,
      explanation: 'Session storage patterns with auto-save, quota handling, and cleanup strategies.'
    },
    {
      title: 'Advanced Storage Patterns',
      language: 'TypeScript',
      code: `export class AdvancedStorageService {
  // Storage with expiration
  setWithExpiry(key: string, value: any, ttl: number) {
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + ttl
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  getWithExpiry<T>(key: string): T | null {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    try {
      const item = JSON.parse(itemStr);
      const now = new Date();
      
      if (now.getTime() > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      return item.value;
    } catch {
      return null;
    }
  }

  // Compressed storage for large data
  setCompressed(key: string, value: any) {
    try {
      const compressed = LZString.compress(JSON.stringify(value));
      localStorage.setItem(key, compressed);
    } catch (error) {
      console.error('Compression failed:', error);
    }
  }

  getCompressed<T>(key: string): T | null {
    try {
      const compressed = localStorage.getItem(key);
      if (!compressed) return null;
      
      const decompressed = LZString.decompress(compressed);
      return JSON.parse(decompressed);
    } catch (error) {
      console.error('Decompression failed:', error);
      return null;
    }
  }

  // Storage usage analytics
  getStorageStats() {
    let totalSize = 0;
    const keys = Object.keys(localStorage);
    
    const stats = keys.map(key => {
      const size = localStorage.getItem(key)?.length || 0;
      totalSize += size;
      return { key, size };
    });

    return {
      totalKeys: keys.length,
      totalSize,
      usage: stats.sort((a, b) => b.size - a.size)
    };
  }
}`,
      explanation: 'Advanced storage patterns including expiration, compression, and usage analytics.'
    }
  ];

  // Explanation sections data
  explanationSections: ExplanationSection[] = [
    {
      title: 'Storage Types and Differences',
      content: `<strong>localStorage:</strong> Persistent storage that survives browser restarts and system reboots until explicitly cleared.<br>
                <strong>sessionStorage:</strong> Temporary storage that's cleared when the browser tab is closed.<br>
                <strong>Use Cases:</strong> localStorage for user preferences, sessionStorage for form data and navigation state.`
    },
    {
      title: 'Cross-Tab Communication',
      content: `Storage events enable real-time communication between tabs. When one tab modifies localStorage, other tabs receive storage events with the changed key, old value, and new value. This enables synchronized user experiences across multiple tabs.`
    },
    {
      title: 'Error Handling and Limits',
      content: `Always wrap storage operations in try-catch blocks. Handle <code>QuotaExceededError</code> gracefully by clearing old data or showing user warnings. Most browsers limit storage to 5-10MB per origin.`
    },
    {
      title: 'Best Practices',
      content: `Use consistent key naming conventions, implement data versioning for schema changes, avoid storing sensitive data, compress large datasets, and always provide fallback values for missing data.`
    }
  ];

  // Pros and cons data
  prosConsData: ProsConsData = {
    title: '⚖️ Browser Storage Analysis',
    pros: [
      { text: 'Persistent data across page reloads and sessions', highlight: true },
      { text: 'Cross-tab communication with storage events' },
      { text: 'Simple synchronous API' },
      { text: 'No server requests needed' },
      { text: 'Works offline' },
      { text: 'Good browser support' }
    ],
    cons: [
      { text: 'Limited storage capacity (5-10MB)', highlight: true },
      { text: 'Only stores strings (requires serialization)' },
      { text: 'Synchronous API can block UI' },
      { text: 'Not available in private/incognito mode' },
      { text: 'Data can be cleared by user or browser' },
      { text: 'Not secure for sensitive data' }
    ]
  };

  // Demo methods
  savePreferences() {
    this.preferences.lastLogin = new Date().toISOString();
    this.storageService.setItem('userPreferences', this.preferences);
    this.lastUpdated = new Date();
  }

  loadPreferences() {
    const defaultPrefs: UserPreferences = {
      theme: 'light',
      language: 'en',
      notifications: true,
      autoSave: false,
      pageSize: 20
    };
    this.preferences = this.storageService.getItem('userPreferences', defaultPrefs);
  }

  saveSessionState() {
    try {
      sessionStorage.setItem('appSessionState', JSON.stringify(this.sessionState));
      this.lastUpdated = new Date();
    } catch (error) {
      console.error('Failed to save session state:', error);
    }
  }

  loadSessionState() {
    try {
      const stored = sessionStorage.getItem('appSessionState');
      if (stored) {
        this.sessionState = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load session state:', error);
    }
  }

  addFilter(filterText: string) {
    if (filterText.trim() && !this.sessionState.filters.includes(filterText.trim())) {
      this.sessionState.filters.push(filterText.trim());
      this.saveSessionState();
    }
  }

  removeFilter(index: number) {
    this.sessionState.filters.splice(index, 1);
    this.saveSessionState();
  }

  exportData() {
    const exportData = {
      preferences: this.preferences,
      sessionState: this.sessionState,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'storage-data.json';
    link.click();
    
    URL.revokeObjectURL(url);
  }

  importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importData = JSON.parse(e.target?.result as string);
            if (importData.preferences) {
              this.preferences = importData.preferences;
              this.savePreferences();
            }
            if (importData.sessionState) {
              this.sessionState = importData.sessionState;
              this.saveSessionState();
            }
            console.log('Data imported successfully');
          } catch (error) {
            console.error('Failed to import data:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    
    input.click();
  }

  clearLocalStorage() {
    if (confirm('Are you sure you want to clear all localStorage data?')) {
      this.storageService.clear();
      this.loadPreferences(); // Reload defaults
    }
  }

  clearSessionStorage() {
    if (confirm('Are you sure you want to clear all sessionStorage data?')) {
      sessionStorage.clear();
      this.sessionState = {
        currentPage: 'dashboard',
        searchQuery: '',
        filters: [],
        selectedItems: [],
        viewMode: 'grid'
      };
    }
  }

  resetToDefaults() {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      this.preferences = {
        theme: 'light',
        language: 'en',
        notifications: true,
        autoSave: false,
        pageSize: 20
      };
      this.sessionState = {
        currentPage: 'dashboard',
        searchQuery: '',
        filters: [],
        selectedItems: [],
        viewMode: 'grid'
      };
      this.savePreferences();
      this.saveSessionState();
    }
  }

  getStorageSize(storageType: 'localStorage' | 'sessionStorage'): number {
    try {
      const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
      let totalSize = 0;
      
      for (let key in storage) {
        if (storage.hasOwnProperty(key)) {
          totalSize += storage[key].length + key.length;
        }
      }
      
      return Math.round(totalSize / 1024 * 100) / 100; // Convert to KB
    } catch {
      return 0;
    }
  }
}
