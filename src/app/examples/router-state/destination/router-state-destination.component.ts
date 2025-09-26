import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { RouterStateService } from '../router-state.service';
import { 
  LearningNotesComponent,
  CodeExamplesComponent,
  ExplanationSectionComponent,
  ProsConsSectionComponent 
} from '../../../shared';

interface StateHistoryEntry {
  timestamp: string;
  action: string;
  route: string;
  stateKeys: string[];
}

interface ProcessingResult {
  timestamp: string;
  action: string;
  status: 'success' | 'warning' | 'error';
  details: string;
}

@Component({
  selector: 'app-router-state-destination',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LearningNotesComponent,
    CodeExamplesComponent,
    ExplanationSectionComponent,
    ProsConsSectionComponent
  ],
  templateUrl: './router-state-destination.component.html',
  styleUrls: ['./router-state-destination.component.css']
})
export class RouterStateDestinationComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private routerStateService = inject(RouterStateService);
  
  // Component state
  componentRole: 'source' | 'destination' = 'destination';
  
  // Demo data
  demoData = {
    timestamp: new Date().toISOString(),
    userPreferences: {
      theme: 'dark',
      language: 'en-US',
      notifications: true
    },
    sessionData: {
      userId: 'user123',
      role: 'admin',
      permissions: ['read', 'write', 'delete']
    },
    appState: {
      currentView: 'dashboard',
      unsavedChanges: false
    }
  };
  
  // Custom data builder
  customData = {
    key: 'customKey',
    value: 'customValue',
    type: 'string',
    metadata: '{}'
  };
  
  // State history
  stateHistory: StateHistoryEntry[] = [];
  
  // Received state (for destination role)
  receivedState: any = null;
  
  // Processing results
  processingResults: ProcessingResult[] = [];
  
  ngOnInit() {
    console.log('🎯 DESTINATION COMPONENT INITIALIZED');
    
    // Method 1: Subscribe to service (immediate)
    this.routerStateService.state$.subscribe(state => {
      if (state) {
        console.log('📥 RECEIVED VIA SERVICE:', state);
        this.receivedState = state;
        this.componentRole = 'destination';
        this.addToHistory('received', this.router.url, Object.keys(this.receivedState));
        this.addProcessingResult('state_received', 'success', `Received state with ${Object.keys(this.receivedState).length} properties`);
        // Don't clear service state here - let service auto-clear
        return; // Exit early if service worked
      }
    });
    
    // Method 2: Check query params for dataId
    this.route.queryParams.subscribe(params => {
      const dataId = params['dataId'];
      if (dataId && !this.receivedState) {
        console.log('🔍 Found dataId in query params:', dataId);
        const storedData = sessionStorage.getItem(dataId);
        if (storedData) {
          try {
            this.receivedState = JSON.parse(storedData);
            console.log('📥 RECEIVED VIA QUERY PARAM:', this.receivedState);
            this.componentRole = 'destination';
            this.addToHistory('received', this.router.url, Object.keys(this.receivedState));
            this.addProcessingResult('state_received', 'success', `Received state with ${Object.keys(this.receivedState).length} properties`);
            // Clean up
            sessionStorage.removeItem(dataId);
            return;
          } catch (e) {
            console.error('❌ Failed to parse query param data:', e);
          }
        }
      }
    });
    
    // Method 3: Listen for navigation events to catch subsequent navigations
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.url.includes('/examples/router-state/destination')) {
          console.log('🔄 NAVIGATION TO DESTINATION DETECTED:', event.url);
          setTimeout(() => {
            this.checkForNewState();
          }, 50);
        }
      });
    
    // Method 4: Fallback checks
    setTimeout(() => {
      if (!this.receivedState) {
        console.log('🔄 TRYING FALLBACK METHODS...');
        this.tryGetRouterState();
      }
    }, 100);
  }

  private checkForNewState() {
    const serviceState = this.routerStateService.getRouterState();
    if (serviceState && serviceState.navigationId !== this.receivedState?.navigationId) {
      console.log('🆕 NEW STATE DETECTED:', serviceState);
      this.receivedState = serviceState;
      this.componentRole = 'destination';
      this.addToHistory('received', this.router.url, Object.keys(this.receivedState));
      this.addProcessingResult('state_received', 'success', `Received NEW state with ${Object.keys(this.receivedState).length} properties`);
    }
  }

  private tryGetRouterState() {
    let stateFound = false;
    
    // Method 1: Check service state (most reliable - immediate access)
    const serviceState = this.routerStateService.getRouterState();
    if (serviceState) {
      console.log('Navigation state received via RouterStateService:', serviceState);
      this.receivedState = serviceState;
      this.componentRole = 'destination';
      stateFound = true;
      // Don't clear service state here - let service auto-clear
    }
    
    // Method 2: Check current navigation (works during navigation)
    if (!stateFound) {
      const navigation = this.router.getCurrentNavigation();
      console.log('Current navigation:', navigation);
      
      if (navigation?.extras?.state) {
        console.log('Navigation state received via getCurrentNavigation():', navigation.extras.state);
        this.receivedState = navigation.extras.state;
        this.componentRole = 'destination';
        stateFound = true;
      }
    }
    
    // Method 3: Check sessionStorage (fallback)
    if (!stateFound) {
      const storedState = sessionStorage.getItem('routerState');
      console.log('Checking sessionStorage for routerState:', storedState);
      if (storedState) {
        try {
          this.receivedState = JSON.parse(storedState);
          console.log('Navigation state received via sessionStorage:', this.receivedState);
          this.componentRole = 'destination';
          stateFound = true;
          // Clean up after use
          sessionStorage.removeItem('routerState');
        } catch (e) {
          console.error('Error parsing stored router state:', e);
        }
      }
    }
    
    // Method 4: Check history.state as additional fallback
    if (!stateFound && window.history.state) {
      console.log('Checking window.history.state:', window.history.state);
      if (window.history.state.navigationId || window.history.state.type) {
        this.receivedState = window.history.state;
        console.log('Navigation state received via window.history.state:', this.receivedState);
        this.componentRole = 'destination';
        stateFound = true;
      }
    }
    
    if (stateFound) {
      this.addToHistory('received', this.router.url, Object.keys(this.receivedState));
      this.addProcessingResult('state_received', 'success', `Received state with ${Object.keys(this.receivedState).length} properties`);
    } else {
      console.log('No navigation state found in any method');
      this.addProcessingResult('state_check', 'warning', 'No navigation state found via any method');
    }
  }
  
  // Component role switching
  switchToSource() {
    this.componentRole = 'source';
    this.receivedState = null;
  }
  
  switchToDestination() {
    this.componentRole = 'destination';
  }
  
  // Navigation methods
  navigateWithUserData() {
    const state = {
      type: 'user-preferences',
      timestamp: new Date().toISOString(),
      data: this.demoData.userPreferences
    };
    
    this.navigateWithState(state, '/examples/router-state/destination');
    this.addToHistory('sent-user', '/examples/router-state/destination', Object.keys(state));
  }
  
  navigateWithSessionData() {
    const state = {
      type: 'session-data',
      timestamp: new Date().toISOString(),
      data: this.demoData.sessionData
    };
    
    this.navigateWithState(state, '/examples/router-state/destination');
    this.addToHistory('sent-session', '/examples/router-state/destination', Object.keys(state));
  }
  
  navigateWithAppState() {
    const state = {
      type: 'app-state',
      timestamp: new Date().toISOString(),
      data: this.demoData.appState
    };
    
    this.navigateWithState(state, '/examples/router-state/destination');
    this.addToHistory('sent-app', '/examples/router-state/destination', Object.keys(state));
  }
  
  navigateWithCompleteData() {
    const state = {
      type: 'complete-data',
      timestamp: new Date().toISOString(),
      data: this.demoData
    };
    
    this.navigateWithState(state, '/examples/router-state/destination');
    this.addToHistory('sent-complete', '/examples/router-state/destination', Object.keys(state));
  }
  
  navigateWithCustomData() {
    try {
      const metadata = this.customData.metadata ? JSON.parse(this.customData.metadata) : {};
      
      const state = {
        type: 'custom-data',
        timestamp: new Date().toISOString(),
        data: {
          [this.customData.key]: this.parseCustomValue(this.customData.value, this.customData.type),
          metadata
        }
      };
      
      this.navigateWithState(state, '/examples/router-state/destination');
      this.addToHistory('sent-custom', '/examples/router-state/destination', Object.keys(state));
    } catch (error) {
      this.addProcessingResult('navigate-custom', 'error', `Failed to parse custom data: ${error}`);
    }
  }


  
  private navigateWithState(state: any, route: string) {
    this.router.navigate([route], { state });
  }
  
  private parseCustomValue(value: string, type: string): any {
    switch (type) {
      case 'string': return value;
      case 'number': return Number(value);
      case 'boolean': return value.toLowerCase() === 'true';
      case 'object': return JSON.parse(value);
      default: return value;
    }
  }
  
  // State processing (for destination role)
  processReceivedState() {
    if (!this.receivedState) {
      this.addProcessingResult('process', 'warning', 'No state data to process');
      return;
    }
    
    try {
      // Simulate processing based on state type
      const stateType = this.receivedState.type || 'unknown';
      
      switch (stateType) {
        case 'user-preferences':
          this.processUserPreferences(this.receivedState.data);
          break;
        case 'session-data':
          this.processSessionData(this.receivedState.data);
          break;
        case 'app-state':
          this.processAppState(this.receivedState.data);
          break;
        case 'complete-data':
          this.processCompleteData(this.receivedState.data);
          break;
        case 'custom-data':
          this.processCustomData(this.receivedState.data);
          break;
        default:
          this.addProcessingResult('process', 'warning', `Unknown state type: ${stateType}`);
      }
    } catch (error) {
      this.addProcessingResult('process', 'error', `Processing failed: ${error}`);
    }
  }
  
  private processUserPreferences(data: any) {
    this.addProcessingResult('process-user', 'success', 
      `Applied user preferences: theme=${data.theme}, language=${data.language}, notifications=${data.notifications}`);
  }
  
  private processSessionData(data: any) {
    this.addProcessingResult('process-session', 'success', 
      `Loaded session for user ${data.userId} with role ${data.role} and ${data.permissions?.length || 0} permissions`);
  }
  
  private processAppState(data: any) {
    this.addProcessingResult('process-app', 'success', 
      `Restored app state: view=${data.currentView}, unsaved=${data.unsavedChanges}`);
  }
  
  private processCompleteData(data: any) {
    this.addProcessingResult('process-complete', 'success', 
      `Processed complete data set with ${Object.keys(data).length} data categories`);
  }
  
  private processCustomData(data: any) {
    const keys = Object.keys(data).filter(key => key !== 'metadata');
    this.addProcessingResult('process-custom', 'success', 
      `Processed custom data with keys: ${keys.join(', ')}`);
  }
  
  exportReceivedState() {
    if (!this.receivedState) {
      this.addProcessingResult('export', 'warning', 'No state data to export');
      return;
    }
    
    try {
      const dataStr = JSON.stringify(this.receivedState, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `router-state-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      this.addProcessingResult('export', 'success', 'State data exported successfully');
    } catch (error) {
      this.addProcessingResult('export', 'error', `Export failed: ${error}`);
    }
  }
  
  clearReceivedState() {
    this.receivedState = null;
    this.addProcessingResult('clear', 'success', 'State data cleared');
  }
  
  // History management
  private addToHistory(action: string, route: string, stateKeys: string[]) {
    this.stateHistory.unshift({
      timestamp: new Date().toISOString(),
      action,
      route,
      stateKeys
    });
    
    // Keep only last 10 entries
    if (this.stateHistory.length > 10) {
      this.stateHistory = this.stateHistory.slice(0, 10);
    }
  }
  
  // Processing results management
  private addProcessingResult(action: string, status: 'success' | 'warning' | 'error', details: string) {
    this.processingResults.unshift({
      timestamp: new Date().toISOString(),
      action,
      status,
      details
    });
    
    // Keep only last 10 results
    if (this.processingResults.length > 10) {
      this.processingResults = this.processingResults.slice(0, 10);
    }
  }
  
  // TrackBy functions for performance
  trackByProcessingResult(index: number, result: ProcessingResult): string {
    return result.timestamp + result.action;
  }
  
  // Educational content
  getLearningNotes(): Array<{title: string; content: string; type: 'tip' | 'warning' | 'info'}> {
    return [
      { title: 'Router State Concept', content: 'Router state allows passing temporary data during navigation without showing it in the URL', type: 'info' },
      { title: 'Implementation', content: 'State data is available in the destination component through Router.getCurrentNavigation()', type: 'tip' },
      { title: 'Use Case', content: 'Router state is perfect for passing sensitive information or large objects between routes', type: 'tip' },
      { title: 'Security Benefit', content: 'Unlike query parameters, router state data is not visible in the browser URL', type: 'info' },
      { title: 'Limitation', content: 'State data is lost when the user refreshes the page or navigates away', type: 'warning' },
      { title: 'Best Practice', content: 'Use router state for wizard flows, form data, or temporary application state', type: 'tip' },
      { title: 'Integration', content: 'Router state works well with Angular\'s navigation guards for data validation', type: 'info' }
    ];
  }
  
  getCodeExamples(): Array<{title: string; code: string; explanation: string; language: string}> {
    return [
      {
        title: 'Navigating with State',
        language: 'typescript',
        code: `// Source component
constructor(private router: Router) {}

navigateWithData() {
  const state = {
    userPreferences: { theme: 'dark', language: 'en' },
    timestamp: new Date().toISOString()
  };
  
  this.router.navigate(['/destination'], { state });
}`,
        explanation: 'Use the state option in router.navigate() to pass data to the destination route'
      },
      {
        title: 'Receiving State Data',
        language: 'typescript',
        code: `// Destination component
ngOnInit() {
  const navigation = this.router.getCurrentNavigation();
  if (navigation?.extras.state) {
    this.receivedData = navigation.extras.state;
    console.log('Received state:', this.receivedData);
  }
}`,
        explanation: 'Access state data in the destination component using getCurrentNavigation()'
      },
      {
        title: 'Complex State Data',
        language: 'typescript',
        code: `const complexState = {
  formData: { name: 'John', email: 'john@example.com' },
  metadata: { step: 2, totalSteps: 5 },
  validation: { errors: [], isValid: true },
  temporaryFiles: [/* file objects */]
};

this.router.navigate(['/review'], { 
  state: complexState 
});`,
        explanation: 'Router state can handle complex objects, arrays, and nested data structures'
      },
      {
        title: 'State with Route Guards',
        language: 'typescript',
        code: `// Route guard
canActivate(route: ActivatedRouteSnapshot): boolean {
  const navigation = this.router.getCurrentNavigation();
  const state = navigation?.extras.state;
  
  if (!state?.requiredData) {
    this.router.navigate(['/error']);
    return false;
  }
  
  return true;
}`,
        explanation: 'Combine router state with guards to ensure required data is present'
      }
    ];
  }
  
  getProsAndCons(): {pros: Array<{id: string; text: string}>; cons: Array<{id: string; text: string}>} {
    return {
      pros: [
        { id: '1', text: 'Data not visible in URL (secure for sensitive information)' },
        { id: '2', text: 'Can pass complex objects and large data structures' },
        { id: '3', text: 'No URL length limitations like query parameters' },
        { id: '4', text: 'Maintains clean URLs for better user experience' },
        { id: '5', text: 'Perfect for temporary data transfer between routes' },
        { id: '6', text: 'Integrates seamlessly with Angular\'s routing system' },
        { id: '7', text: 'Works well with navigation guards for validation' }
      ],
      cons: [
        { id: '1', text: 'Data is lost on page refresh or direct URL access' },
        { id: '2', text: 'Not suitable for bookmarkable or shareable state' },
        { id: '3', text: 'Requires programmatic navigation (not href links)' },
        { id: '4', text: 'Debugging can be more difficult (data not in URL)' },
        { id: '5', text: 'Not SEO-friendly for public-facing applications' },
        { id: '6', text: 'Limited browser back/forward button support' },
        { id: '7', text: 'Requires proper error handling for missing state' }
      ]
    };
  }
  
  getExplanationSections(): Array<{title: string; content: string}> {
    return [
      {
        title: 'How Router State Works',
        content: 'Router state is a feature of Angular Router that allows you to pass data between routes without exposing it in the URL. When you navigate programmatically using router.navigate(), you can include a state object that becomes available to the destination component. This is particularly useful for passing sensitive information, large objects, or temporary data that shouldn\'t be visible in the browser\'s address bar.'
      },
      {
        title: 'When to Use Router State',
        content: 'Use router state when you need to pass data that is temporary, sensitive, or too large for URL parameters. Common use cases include multi-step forms (wizards), passing user preferences, transferring complex objects between views, or maintaining application state during navigation. Router state is ideal when you want clean URLs but need to share data between components.'
      },
      {
        title: 'Implementation Considerations',
        content: 'Remember that router state data is ephemeral - it exists only during the navigation and is lost if the user refreshes the page or navigates directly to a URL. Always implement fallback mechanisms for when state data is not available. Consider combining router state with other persistence methods (like local storage) for critical data that needs to survive page refreshes.'
      },
      {
        title: 'Best Practices',
        content: 'Structure your state data consistently, validate received state in destination components, use TypeScript interfaces to define state structure, implement proper error handling for missing or invalid state, and consider the user experience when state data is not available. For large applications, consider using a state management library alongside router state for more complex scenarios.'
      }
    ];
  }
}
