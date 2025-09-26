import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { Subject, combineLatest } from 'rxjs';
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

interface RouteParameter {
  key: string;
  value: string;
  type: 'route' | 'query' | 'fragment';
}

interface ParameterHistoryEntry {
  timestamp: Date;
  action: string;
  details: string;
  isCurrent: boolean;
}

interface CustomQueryParam {
  key: string;
  value: string;
}

@Component({
  selector: 'app-user-detail-example',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    LearningNotesComponent,
    CodeExamplesComponent,
    ExplanationSectionComponent,
    ProsConsSectionComponent
  ],
  templateUrl: './user-detail.page.html',
  styleUrls: ['./user-detail.page.css']
})
export class UserDetailExampleComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  // Observable streams for route data
  id$ = this.route.paramMap.pipe(map(params => params.get('id')));
  filters$ = this.route.queryParamMap.pipe(map(params => {
    const result: { [key: string]: string } = {};
    params.keys.forEach(key => {
      const value = params.get(key);
      if (value) result[key] = value;
    });
    return result;
  }));
  fragment$ = this.route.fragment;

  // Component state
  currentParams: RouteParameter[] = [];
  currentUrl = '';
  matchedRoute = '/examples/router-params/:id';
  parameterHistory: ParameterHistoryEntry[] = [];
  navigationCount = 0;
  uniqueIds = new Set<string>();
  uniqueQueryKeys = new Set<string>();
  fragmentsUsed = new Set<string>();

  // Custom route builder
  customId = '';
  customQueryParams: CustomQueryParam[] = [{ key: '', value: '' }];
  customFragment = '';
  previewUrl = '';

  // Quick navigation examples
  quickNavExamples = [
    { title: 'Simple ID', route: '/examples/router-params/123' },
    { title: 'With Query', route: '/examples/router-params/456?filter=active&page=2' },
    { title: 'With Fragment', route: '/examples/router-params/789#section1' },
    { title: 'Full Example', route: '/examples/router-params/999?q=search&status=active&page=3#profile' }
  ];

  ngOnInit() {
    this.setupRouteSubscriptions();
    this.initializeHistory();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupRouteSubscriptions() {
    // Combined subscription for all route data
    combineLatest([
      this.id$.pipe(startWith(null)),
      this.filters$.pipe(startWith({})),
      this.fragment$.pipe(startWith(null))
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([id, queryParams, fragment]: [string | null, any, string | null]) => {
      this.updateCurrentParams(id, queryParams, fragment);
      this.updateHistory(id, queryParams, fragment);
      this.updateStatistics(id, queryParams, fragment);
      this.updateCurrentUrl();
    });
  }

  private updateCurrentParams(id: string | null, queryParams: any, fragment: string | null) {
    this.currentParams = [];

    if (id) {
      this.currentParams.push({
        key: 'id',
        value: id,
        type: 'route'
      });
    }

    Object.entries(queryParams).forEach(([key, value]) => {
      this.currentParams.push({
        key,
        value: value as string,
        type: 'query'
      });
    });

    if (fragment) {
      this.currentParams.push({
        key: 'fragment',
        value: fragment,
        type: 'fragment'
      });
    }
  }

  private updateHistory(id: string | null, queryParams: any, fragment: string | null) {
    // Mark all previous entries as not current
    this.parameterHistory.forEach(entry => entry.isCurrent = false);

    let action = 'Navigation';
    let details = '';

    if (id) {
      details += `ID: ${id}`;
    }

    const queryKeys = Object.keys(queryParams);
    if (queryKeys.length > 0) {
      details += details ? ', ' : '';
      details += `Query: ${queryKeys.join(', ')}`;
    }

    if (fragment) {
      details += details ? ', ' : '';
      details += `Fragment: ${fragment}`;
    }

    if (!details) {
      details = 'No parameters';
    }

    this.parameterHistory.unshift({
      timestamp: new Date(),
      action,
      details,
      isCurrent: true
    });

    // Keep only last 10 entries
    if (this.parameterHistory.length > 10) {
      this.parameterHistory = this.parameterHistory.slice(0, 10);
    }
  }

  private updateStatistics(id: string | null, queryParams: any, fragment: string | null) {
    this.navigationCount++;

    if (id) {
      this.uniqueIds.add(id);
    }

    Object.keys(queryParams).forEach(key => {
      this.uniqueQueryKeys.add(key);
    });

    if (fragment) {
      this.fragmentsUsed.add(fragment);
    }
  }

  private updateCurrentUrl() {
    this.currentUrl = this.router.url;
  }

  private initializeHistory() {
    this.parameterHistory.push({
      timestamp: new Date(),
      action: 'Page Load',
      details: 'Router parameters example initialized',
      isCurrent: false
    });
  }

  // Learning notes data
  learningNotes: LearningNote[] = [
    {
      title: 'ActivatedRoute Service',
      content: 'Use ActivatedRoute service to access route parameters, query parameters, and fragments as observables.',
      type: 'tip'
    },
    {
      title: 'paramMap vs params',
      content: 'Use paramMap instead of params for better type safety and consistent API. paramMap provides get() method.',
      type: 'info'
    },
    {
      title: 'Query Parameters',
      content: 'Query parameters are optional and don\'t affect route matching. Perfect for filters, pagination, and search.',
      type: 'tip'
    },
    {
      title: 'URL Fragments',
      content: 'Fragments (hash) are used for in-page navigation and don\'t trigger route changes. Great for scrolling to sections.',
      type: 'info'
    },
    {
      title: 'Memory Management',
      content: 'Always unsubscribe from route observables to prevent memory leaks, or use AsyncPipe for automatic subscription management.',
      type: 'warning'
    }
  ];

  // Code examples data
  codeExamples: CodeExample[] = [
    {
      title: 'Basic Route Parameter Access',
      language: 'TypeScript',
      code: `import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-user-detail',
  template: \`
    <div *ngIf="userId$ | async as userId">
      <h2>User Details for ID: {{ userId }}</h2>
    </div>
    <div *ngIf="userQuery$ | async as query">
      <p>Search Query: {{ query }}</p>
    </div>
  \`
})
export class UserDetailComponent {
  private route = inject(ActivatedRoute);
  
  // Route parameter (from /user/:id)
  userId$ = this.route.paramMap.pipe(
    map(params => params.get('id'))
  );
  
  // Query parameter (from ?q=search)
  userQuery$ = this.route.queryParamMap.pipe(
    map(params => params.get('q'))
  );
  
  // URL fragment (from #section)
  fragment$ = this.route.fragment;
}

// Route configuration
const routes: Routes = [
  { path: 'user/:id', component: UserDetailComponent }
];`,
      explanation: 'Basic route parameter access using ActivatedRoute service with reactive patterns.'
    },
    {
      title: 'Advanced Route Data Handling',
      language: 'TypeScript',
      code: `import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { combineLatest, Subject } from 'rxjs';
import { map, takeUntil, distinctUntilChanged } from 'rxjs/operators';

interface UserFilters {
  search?: string;
  category?: string;
  status?: string;
  page?: number;
  sort?: string;
}

@Component({
  selector: 'app-advanced-user-detail',
  template: \`
    <div class="user-detail">
      <h2>User {{ userId }}</h2>
      <div class="filters" *ngIf="filters">
        <div *ngFor="let filter of filters | keyvalue">
          <strong>{{ filter.key }}:</strong> {{ filter.value }}
        </div>
      </div>
    </div>
  \`
})
export class AdvancedUserDetailComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  userId: string | null = null;
  filters: UserFilters = {};
  
  constructor(private route: ActivatedRoute) {}
  
  ngOnInit() {
    // Combine route and query parameters
    combineLatest([
      this.route.paramMap,
      this.route.queryParamMap
    ]).pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged()
    ).subscribe(([params, queryParams]) => {
      this.userId = params.get('id');
      this.filters = this.parseQueryParams(queryParams);
      this.loadUserData();
    });
    
    // Handle fragment changes for scrolling
    this.route.fragment.pipe(
      takeUntil(this.destroy$)
    ).subscribe(fragment => {
      if (fragment) {
        this.scrollToSection(fragment);
      }
    });
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private parseQueryParams(paramMap: ParamMap): UserFilters {
    return {
      search: paramMap.get('q') || undefined,
      category: paramMap.get('category') || undefined,
      status: paramMap.get('status') || undefined,
      page: paramMap.get('page') ? +paramMap.get('page')! : undefined,
      sort: paramMap.get('sort') || undefined
    };
  }
  
  private loadUserData() {
    // Load user data based on ID and filters
    console.log('Loading user data:', this.userId, this.filters);
  }
  
  private scrollToSection(fragment: string) {
    const element = document.getElementById(fragment);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}`,
      explanation: 'Advanced route data handling with combined parameters, type safety, and proper lifecycle management.'
    },
    {
      title: 'Navigation with Parameters',
      language: 'TypeScript',
      code: `import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-navigation-example',
  template: \`
    <div class="navigation-examples">
      <!-- Declarative navigation -->
      <a [routerLink]="['/user', userId]" 
         [queryParams]="{ q: searchTerm, page: currentPage }"
         [fragment]="'profile'">
        View User Profile
      </a>
      
      <!-- Programmatic navigation -->
      <button (click)="navigateToUser(123)">Go to User 123</button>
      <button (click)="addFilter('active')">Add Status Filter</button>
      <button (click)="updatePage(2)">Go to Page 2</button>
    </div>
  \`
})
export class NavigationExampleComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  
  userId = 42;
  searchTerm = 'angular';
  currentPage = 1;
  
  // Navigate to specific user
  navigateToUser(id: number) {
    this.router.navigate(['/user', id], {
      queryParams: { 
        q: this.searchTerm,
        timestamp: Date.now()
      },
      fragment: 'details'
    });
  }
  
  // Add or update query parameters
  addFilter(status: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { status },
      queryParamsHandling: 'merge' // Preserve existing params
    });
  }
  
  // Update single query parameter
  updatePage(page: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page },
      queryParamsHandling: 'merge'
    });
  }
  
  // Replace all query parameters
  resetFilters() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {} // Clear all query params
    });
  }
  
  // Navigate with state (not visible in URL)
  navigateWithState(userId: number) {
    this.router.navigate(['/user', userId], {
      state: { 
        fromComponent: 'NavigationExample',
        timestamp: Date.now()
      }
    });
  }
}`,
      explanation: 'Navigation patterns including declarative and programmatic navigation with parameter handling.'
    },
    {
      title: 'Testing Route Parameters',
      language: 'TypeScript',
      code: `import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { UserDetailComponent } from './user-detail.component';

describe('UserDetailComponent', () => {
  let component: UserDetailComponent;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  
  beforeEach(() => {
    // Create mock ActivatedRoute
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', [], {
      paramMap: of(new Map([['id', '123']])),
      queryParamMap: of(new Map([
        ['q', 'angular'],
        ['status', 'active']
      ])),
      fragment: of('profile')
    });
    
    TestBed.configureTestingModule({
      imports: [UserDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    });
    
    const fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;
  });
  
  it('should extract route parameters', (done) => {
    component.userId$.subscribe(id => {
      expect(id).toBe('123');
      done();
    });
  });
  
  it('should handle query parameters', (done) => {
    component.filters$.subscribe(filters => {
      expect(filters.q).toBe('angular');
      expect(filters.status).toBe('active');
      done();
    });
  });
  
  it('should handle fragments', (done) => {
    component.fragment$.subscribe(fragment => {
      expect(fragment).toBe('profile');
      done();
    });
  });
});

// Testing navigation
import { Router } from '@angular/router';
import { Location } from '@angular/common';

describe('Navigation Tests', () => {
  let router: Router;
  let location: Location;
  
  beforeEach(() => {
    // Setup TestBed with routing
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([
        { path: 'user/:id', component: UserDetailComponent }
      ])]
    });
    
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });
  
  it('should navigate to user with parameters', async () => {
    await router.navigate(['/user', 123], {
      queryParams: { q: 'test', page: 2 },
      fragment: 'details'
    });
    
    expect(location.path()).toBe('/user/123?q=test&page=2#details');
  });
  
  it('should update query parameters', async () => {
    await router.navigate(['/user', 123]);
    await router.navigate([], {
      queryParams: { status: 'active' },
      queryParamsHandling: 'merge'
    });
    
    expect(location.path()).toContain('status=active');
  });
});`,
      explanation: 'Comprehensive testing patterns for route parameters including mocking ActivatedRoute and testing navigation.'
    }
  ];

  // Explanation sections data
  explanationSections: ExplanationSection[] = [
    {
      title: 'Route Parameters vs Query Parameters',
      content: `<strong>Route Parameters:</strong> Part of the URL path (e.g., /user/:id) that are required for route matching. 
                Use for essential data like entity IDs that define what page you're on.<br><br>
                <strong>Query Parameters:</strong> Optional parameters after the ? that don't affect route matching. 
                Perfect for filters, search terms, pagination, and any optional state that should be bookmarkable.`
    },
    {
      title: 'Reactive Parameter Handling',
      content: `Angular provides observables for all route data through ActivatedRoute. Use <code>paramMap</code>, <code>queryParamMap</code>, 
                and <code>fragment</code> observables to reactively respond to parameter changes without page reloads. 
                This enables smooth single-page application experiences with bookmarkable URLs.`
    },
    {
      title: 'Parameter Combination Strategies',
      content: `Use <code>combineLatest</code> or <code>withLatestFrom</code> to combine multiple parameter sources. 
                This is essential when your component needs to react to changes in both route parameters and query parameters simultaneously. 
                Always use proper operators like <code>distinctUntilChanged</code> to avoid unnecessary updates.`
    },
    {
      title: 'SEO and User Experience',
      content: `Router parameters make your application SEO-friendly and improve user experience by providing bookmarkable URLs, 
                browser back/forward support, and shareable links. They also enable deep linking, allowing users to navigate 
                directly to specific application states without going through multiple pages.`
    }
  ];

  // Pros and cons data
  prosConsData: ProsConsData = {
    title: '⚖️ Router Parameters Analysis',
    pros: [
      { text: 'Bookmarkable and shareable URLs', highlight: true },
      { text: 'Browser back/forward navigation support' },
      { text: 'SEO-friendly for public content' },
      { text: 'Stateless communication between components' },
      { text: 'Deep linking capabilities' },
      { text: 'Reactive updates without page reload' },
      { text: 'Built into Angular Router' }
    ],
    cons: [
      { text: 'Limited to simple data types (strings/numbers)', highlight: true },
      { text: 'URL length limitations in browsers' },
      { text: 'Visible to users (not suitable for sensitive data)' },
      { text: 'Requires URL encoding for special characters' },
      { text: 'Can become complex with many parameters' },
      { text: 'Browser history pollution with frequent changes' }
    ]
  };

  // Custom route builder methods
  addQueryParam() {
    this.customQueryParams.push({ key: '', value: '' });
  }

  removeQueryParam(param: CustomQueryParam) {
    const index = this.customQueryParams.indexOf(param);
    if (index > -1) {
      this.customQueryParams.splice(index, 1);
    }
    if (this.customQueryParams.length === 0) {
      this.addQueryParam();
    }
  }

  previewCustomRoute() {
    const validParams = this.customQueryParams.filter(p => p.key && p.value);
    const queryString = validParams.length > 0 
      ? '?' + validParams.map(p => `${p.key}=${encodeURIComponent(p.value)}`).join('&')
      : '';
    const fragment = this.customFragment ? `#${this.customFragment}` : '';
    
    this.previewUrl = `/examples/router-params/${this.customId || 'ID'}${queryString}${fragment}`;
  }

  navigateToCustomRoute() {
    if (!this.customId) {
      alert('Please enter a route parameter (ID)');
      return;
    }

    const validParams = this.customQueryParams.filter(p => p.key && p.value);
    const queryParams: { [key: string]: string } = {};
    validParams.forEach(p => queryParams[p.key] = p.value);

    this.router.navigate(['/examples/router-params', this.customId], {
      queryParams: Object.keys(queryParams).length > 0 ? queryParams : undefined,
      fragment: this.customFragment || undefined
    });
  }

  trackByIndex(index: number): number {
    return index;
  }

  trackByTimestamp(index: number, entry: ParameterHistoryEntry): number {
    return entry.timestamp.getTime();
  }

  clearHistory() {
    this.parameterHistory = [];
    this.initializeHistory();
  }

  navigateToExample(example: any) {
    // Parse the route to extract path and parameters
    const [path, queryAndFragment] = example.route.split('?');
    const pathParts = path.split('/');
    const id = pathParts[pathParts.length - 1];

    if (queryAndFragment) {
      const [queryPart, fragment] = queryAndFragment.split('#');
      const queryParams: { [key: string]: string } = {};
      
      if (queryPart) {
        queryPart.split('&').forEach((param: string) => {
          const [key, value] = param.split('=');
          queryParams[key] = value;
        });
      }

      this.router.navigate(['/examples/router-params', id], {
        queryParams: Object.keys(queryParams).length > 0 ? queryParams : undefined,
        fragment: fragment || undefined
      });
    } else {
      this.router.navigate(['/examples/router-params', id]);
    }
  }
}
