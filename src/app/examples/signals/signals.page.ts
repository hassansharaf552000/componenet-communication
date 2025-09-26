import { Component, computed, effect, signal, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { interval } from 'rxjs';
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

interface User {
  id: number;
  name: string;
}

interface ActivityLogEntry {
  timestamp: Date;
  message: string;
}

@Component({
  selector: 'app-signals-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LearningNotesComponent,
    CodeExamplesComponent,
    ExplanationSectionComponent,
    ProsConsSectionComponent
  ],
  templateUrl: './signals.page.html',
  styleUrls: ['./signals.page.css']
})
export class SignalsPageComponent {
  // Basic signals
  counter = signal(0);
  users = signal<User[]>([]);
  activityLog = signal<ActivityLogEntry[]>([]);
  
  // Form state
  newUserName = '';

  // Computed signals
  doubleCounter = computed(() => this.counter() * 2);
  squareCounter = computed(() => this.counter() ** 2);
  isEven = computed(() => this.counter() % 2 === 0);
  userCount = computed(() => this.users().length);
  userNames = computed(() => this.users().map(u => u.name).join(', ') || 'None');

  constructor() {
    // Effects for side effects and logging
    effect(() => {
      const currentCounter = this.counter();
      this.logActivity(`Counter changed to: ${currentCounter}`);
      console.log('🔄 Counter effect triggered:', currentCounter);
      
      // Sync to localStorage
      localStorage.setItem('signals-counter', currentCounter.toString());
    });

    effect(() => {
      const currentUsers = this.users();
      this.logActivity(`Users updated. Total: ${currentUsers.length}`);
      console.log('👥 Users effect triggered:', currentUsers);
      
      // Sync to localStorage
      localStorage.setItem('signals-users', JSON.stringify(currentUsers));
    });

    // Load initial state from localStorage
    this.loadFromStorage();
    this.logActivity('Application initialized with Signals');
  }

  // Learning notes data
  learningNotes: LearningNote[] = [
    {
      title: 'Signals are Reactive',
      content: 'Signals automatically track dependencies and update consumers when values change, providing fine-grained reactivity.',
      type: 'tip'
    },
    {
      title: 'Computed Signals',
      content: 'Computed signals derive values from other signals and only recalculate when their dependencies change.',
      type: 'info'
    },
    {
      title: 'Effects for Side Effects',
      content: 'Use effects to perform side effects (like logging, API calls) when signals change. Effects run automatically.',
      type: 'warning'
    },
    {
      title: 'Better Performance',
      content: 'Signals enable more efficient change detection by only updating what actually changed.',
      type: 'tip'
    }
  ];

  // Code examples data
  codeExamples: CodeExample[] = [
    {
      title: 'Basic Signal Usage',
      language: 'TypeScript',
      code: `import { Component, signal, computed, effect } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: \`
    <div>
      <p>Count: {{ count() }}</p>
      <p>Double: {{ doubleCount() }}</p>
      <button (click)="increment()">+</button>
      <button (click)="decrement()">-</button>
    </div>
  \`
})
export class CounterComponent {
  // Writable signal
  count = signal(0);
  
  // Computed signal (read-only)
  doubleCount = computed(() => this.count() * 2);
  
  constructor() {
    // Effect runs when count changes
    effect(() => {
      console.log('Count changed to:', this.count());
    });
  }
  
  increment() {
    this.count.update(value => value + 1);
  }
  
  decrement() {
    this.count.update(value => value - 1);
  }
}`,
      explanation: 'Basic signal creation with computed values and effects for side effects.'
    },
    {
      title: 'Signal Methods and Updates',
      language: 'TypeScript',
      code: `export class SignalMethodsComponent {
  count = signal(0);
  users = signal<User[]>([]);
  
  // Different ways to update signals
  updateSignals() {
    // Set absolute value
    this.count.set(10);
    
    // Update based on current value
    this.count.update(current => current + 1);
    
    // Mutate arrays/objects (use with caution)
    this.users.mutate(users => {
      users.push({ id: Date.now(), name: 'New User' });
    });
    
    // Better: immutable updates
    this.users.update(users => [
      ...users,
      { id: Date.now(), name: 'New User' }
    ]);
  }
  
  // Reading signal values
  getCurrentValue() {
    const currentCount = this.count(); // Call like function
    return currentCount;
  }
}`,
      explanation: 'Different methods for updating and reading signal values.'
    },
    {
      title: 'Advanced Computed Patterns',
      language: 'TypeScript',
      code: `export class AdvancedComputedComponent {
  users = signal<User[]>([]);
  searchTerm = signal('');
  sortBy = signal<'name' | 'id'>('name');
  
  // Filtered users based on search
  filteredUsers = computed(() => {
    const users = this.users();
    const term = this.searchTerm().toLowerCase();
    
    return users.filter(user => 
      user.name.toLowerCase().includes(term)
    );
  });
  
  // Sorted and filtered users
  sortedFilteredUsers = computed(() => {
    const filtered = this.filteredUsers();
    const sortField = this.sortBy();
    
    return [...filtered].sort((a, b) => {
      if (sortField === 'name') {
        return a.name.localeCompare(b.name);
      }
      return a.id - b.id;
    });
  });
  
  // Complex computed with multiple dependencies
  userStats = computed(() => {
    const users = this.users();
    const filtered = this.filteredUsers();
    
    return {
      total: users.length,
      filtered: filtered.length,
      percentage: users.length > 0 ? 
        Math.round((filtered.length / users.length) * 100) : 0
    };
  });
}`,
      explanation: 'Complex computed signals with filtering, sorting, and statistical calculations.'
    },
    {
      title: 'Effects and Cleanup',
      language: 'TypeScript',
      code: `import { Component, DestroyRef, effect, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export class EffectsComponent {
  data = signal<any[]>([]);
  
  constructor(private destroyRef: DestroyRef) {
    // Basic effect
    effect(() => {
      console.log('Data changed:', this.data());
    });
    
    // Effect with cleanup
    effect((onCleanup) => {
      const subscription = this.startPolling();
      
      onCleanup(() => {
        console.log('Cleaning up effect');
        subscription.unsubscribe();
      });
    });
    
    // Effect that only runs once after first change
    effect(() => {
      const currentData = this.data();
      if (currentData.length > 0) {
        this.initializeComponent(currentData);
      }
    }, { allowSignalWrites: true });
  }
  
  // Async effect pattern
  loadDataEffect = effect(async () => {
    const data = await this.fetchData();
    // Can't write to signals in effects by default
    // Use allowSignalWrites: true or call outside effect
    untracked(() => {
      this.data.set(data);
    });
  });
  
  private startPolling() {
    return interval(1000).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      // Polling logic
    });
  }
}`,
      explanation: 'Advanced effect patterns including cleanup, async operations, and lifecycle management.'
    }
  ];

  // Explanation sections data
  explanationSections: ExplanationSection[] = [
    {
      title: 'What are Signals?',
      content: `Signals are a reactive primitive that holds a value and notifies consumers when the value changes. They provide fine-grained reactivity, meaning only the specific parts of your application that depend on a signal will update when it changes.`
    },
    {
      title: 'Signal Types',
      content: `<strong>Writable Signals:</strong> Created with <code>signal()</code>, can be updated with <code>set()</code>, <code>update()</code>, or <code>mutate()</code>.<br>
                <strong>Computed Signals:</strong> Derived from other signals using <code>computed()</code>, automatically update when dependencies change.<br>
                <strong>Effects:</strong> Run side effects when signals change, created with <code>effect()</code>.`
    },
    {
      title: 'Benefits over Traditional Change Detection',
      content: `Signals enable Angular to skip checking components that haven't changed, leading to better performance. They also provide more predictable reactivity and make it easier to reason about data flow in your application.`
    },
    {
      title: 'Best Practices',
      content: `Use <code>computed()</code> for derived state, <code>effect()</code> for side effects only, prefer immutable updates for better debugging, and avoid complex logic in computed signals for better performance.`
    }
  ];

  // Pros and cons data
  prosConsData: ProsConsData = {
    title: '⚖️ Angular Signals Analysis',
    pros: [
      { text: 'Fine-grained reactivity and better performance', highlight: true },
      { text: 'Automatic dependency tracking' },
      { text: 'More predictable than traditional change detection' },
      { text: 'Easy to compose and derive state' },
      { text: 'Built-in to Angular, no external dependencies' },
      { text: 'Type-safe and compile-time checked' }
    ],
    cons: [
      { text: 'New concept with learning curve', highlight: true },
      { text: 'Still in developer preview (as of Angular 17)' },
      { text: 'Limited interoperability with RxJS' },
      { text: 'Effects cannot write to signals by default' },
      { text: 'May require refactoring existing code' }
    ]
  };

  // Demo methods
  incrementCounter() {
    this.counter.update(value => value + 1);
  }

  decrementCounter() {
    this.counter.update(value => value - 1);
  }

  resetCounter() {
    this.counter.set(0);
  }

  addUser() {
    if (this.newUserName.trim()) {
      const newUser: User = {
        id: Date.now(),
        name: this.newUserName.trim()
      };
      
      this.users.update(users => [...users, newUser]);
      this.newUserName = '';
    }
  }

  removeUser(index: number) {
    this.users.update(users => users.filter((_, i) => i !== index));
  }

  clearUsers() {
    this.users.set([]);
  }

  private logActivity(message: string) {
    const entry: ActivityLogEntry = {
      timestamp: new Date(),
      message
    };
    
    this.activityLog.update(log => {
      const newLog = [...log, entry];
      // Keep only last 10 entries
      return newLog.slice(-10);
    });
  }

  private loadFromStorage() {
    try {
      const savedCounter = localStorage.getItem('signals-counter');
      if (savedCounter) {
        this.counter.set(parseInt(savedCounter, 10));
      }

      const savedUsers = localStorage.getItem('signals-users');
      if (savedUsers) {
        this.users.set(JSON.parse(savedUsers));
      }
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
    }
  }
}
