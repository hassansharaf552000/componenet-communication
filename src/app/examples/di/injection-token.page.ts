import { Component, inject } from '@angular/core';
import { JsonPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { APP_FEATURE_CONFIG } from './app-config.token';
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

interface DemoConfig {
  maxRetries: number;
  timeout: number;
  theme: 'light' | 'dark' | 'auto';
  supportedLanguages: string[];
  enableLogging: boolean;
  enableAnalytics: boolean;
  enableExperiments: boolean;
}

interface ApiLog {
  timestamp: Date;
  message: string;
  level: 'info' | 'warn' | 'error';
}

interface TestScenario {
  name: string;
  description: string;
  mockConfig: any;
}

interface TestResults {
  scenario: string;
  output: string;
}

@Component({
  selector: 'app-injection-token-page',
  standalone: true,
  imports: [
    JsonPipe,
    CommonModule,
    FormsModule,
    LearningNotesComponent,
    CodeExamplesComponent,
    ExplanationSectionComponent,
    ProsConsSectionComponent
  ],
  templateUrl: './injection-token.page.html',
  styleUrls: ['./injection-token.page.css']
})
export class InjectionTokenPageComponent {
  cfg = inject(APP_FEATURE_CONFIG);
  
  selectedEnvironment = 'development';
  activeTab = 'service';
  isLoading = false;
  apiLogs: ApiLog[] = [];
  activeTestScenario: string | null = null;
  testResults: TestResults | null = null;

  demoConfig: DemoConfig = {
    maxRetries: 3,
    timeout: 5000,
    theme: 'light',
    supportedLanguages: ['en', 'es', 'fr', 'de'],
    enableLogging: true,
    enableAnalytics: false,
    enableExperiments: false
  };

  // Service example data
  serviceExample = {
    baseUrl: 'https://api.development.com',
    timeout: 5000,
    retries: 3,
    debug: true
  };

  // Token examples for component demo
  apiTokenExample = {
    baseUrl: 'https://api.example.com',
    version: 'v1',
    timeout: 10000,
    retries: 3
  };

  themeTokenExample = {
    primaryColor: '#16a085',
    secondaryColor: '#1abc9c',
    fontFamily: 'Inter, sans-serif',
    darkMode: false
  };

  featureTokenExample = {
    enableBetaFeatures: true,
    enableAnalytics: false,
    maxUploadSize: '10MB',
    supportedFormats: ['jpg', 'png', 'pdf']
  };

  testScenarios: TestScenario[] = [
    {
      name: 'Development',
      description: 'Testing with development configuration',
      mockConfig: {
        apiBase: 'http://localhost:3000',
        enableDebug: true,
        timeout: 1000
      }
    },
    {
      name: 'Production',
      description: 'Testing with production configuration',
      mockConfig: {
        apiBase: 'https://api.production.com',
        enableDebug: false,
        timeout: 10000
      }
    },
    {
      name: 'Error Scenario',
      description: 'Testing error handling',
      mockConfig: null
    }
  ];

  // Learning notes data
  learningNotes: LearningNote[] = [
    {
      title: 'InjectionToken Basics',
      content: 'InjectionToken creates type-safe tokens for dependency injection when you need to inject values that aren\'t classes.',
      type: 'tip'
    },
    {
      title: 'Type Safety',
      content: 'Always provide generic type parameters to InjectionToken for compile-time type checking: new InjectionToken<MyConfig>(\'config\')',
      type: 'info'
    },
    {
      title: 'Provider Configuration',
      content: 'Register tokens in providers array with useValue, useFactory, or useClass depending on your needs.',
      type: 'tip'
    },
    {
      title: 'Testing with Tokens',
      content: 'Injection tokens make testing easier by allowing you to provide mock configurations without complex setup.',
      type: 'info'
    },
    {
      title: 'Tree-shaking',
      content: 'Tokens help with tree-shaking by avoiding circular dependencies and enabling better static analysis.',
      type: 'warning'
    }
  ];

  // Code examples data
  codeExamples: CodeExample[] = [
    {
      title: 'Creating Injection Tokens',
      language: 'TypeScript',
      code: `// Define configuration interface
interface AppConfig {
  apiBase: string;
  enableDebug: boolean;
  maxRetries: number;
  timeout: number;
}

// Create typed injection token
import { InjectionToken } from '@angular/core';

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config', {
  providedIn: 'root',
  factory: () => ({
    apiBase: 'https://api.example.com',
    enableDebug: false,
    maxRetries: 3,
    timeout: 5000
  })
});

// Alternative: Token without default factory
export const API_BASE_URL = new InjectionToken<string>('api.base.url');

// Token for feature flags
interface FeatureFlags {
  enableBetaFeatures: boolean;
  enableAnalytics: boolean;
  maxUploadSize: string;
}

export const FEATURE_FLAGS = new InjectionToken<FeatureFlags>('feature.flags');`,
      explanation: 'Creating type-safe injection tokens with interfaces and optional factory functions for default values.'
    },
    {
      title: 'Providing Token Values',
      language: 'TypeScript',
      code: `// In main.ts or app.config.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { APP_CONFIG, API_BASE_URL, FEATURE_FLAGS } from './tokens';

bootstrapApplication(AppComponent, {
  providers: [
    // Simple value provider
    { provide: API_BASE_URL, useValue: 'https://api.production.com' },
    
    // Object value provider
    { 
      provide: APP_CONFIG, 
      useValue: {
        apiBase: 'https://api.production.com',
        enableDebug: false,
        maxRetries: 5,
        timeout: 10000
      }
    },
    
    // Factory provider for dynamic values
    {
      provide: FEATURE_FLAGS,
      useFactory: () => {
        const isProduction = environment.production;
        return {
          enableBetaFeatures: !isProduction,
          enableAnalytics: isProduction,
          maxUploadSize: isProduction ? '10MB' : '100MB'
        };
      }
    },
    
    // Factory with dependencies
    {
      provide: APP_CONFIG,
      useFactory: (http: HttpClient) => {
        // Could load config from server
        return loadConfigFromServer(http);
      },
      deps: [HttpClient]
    }
  ]
});

// Environment-specific providers
const developmentProviders = [
  { provide: API_BASE_URL, useValue: 'http://localhost:3000' },
  { provide: APP_CONFIG, useValue: developmentConfig }
];

const productionProviders = [
  { provide: API_BASE_URL, useValue: 'https://api.production.com' },
  { provide: APP_CONFIG, useValue: productionConfig }
];`,
      explanation: 'Different ways to provide values for injection tokens including simple values, objects, and dynamic factories.'
    },
    {
      title: 'Injecting and Using Tokens',
      language: 'TypeScript',
      code: `// Using inject() function (modern approach)
import { Component, inject } from '@angular/core';
import { APP_CONFIG, API_BASE_URL, FEATURE_FLAGS } from './tokens';

@Component({
  selector: 'app-example',
  template: \`
    <div>API Base: {{ config.apiBase }}</div>
    <div>Debug Mode: {{ config.enableDebug }}</div>
    <div *ngIf="features.enableBetaFeatures">
      Beta features are enabled!
    </div>
  \`
})
export class ExampleComponent {
  // Inject using the modern inject() function
  private config = inject(APP_CONFIG);
  private apiUrl = inject(API_BASE_URL);
  private features = inject(FEATURE_FLAGS);
  
  constructor() {
    console.log('API URL:', this.apiUrl);
    console.log('Config:', this.config);
  }
  
  makeApiCall() {
    const url = \`\${this.apiUrl}/users\`;
    const options = {
      timeout: this.config.timeout,
      retries: this.config.maxRetries
    };
    
    return this.http.get(url, options);
  }
}

// Using constructor injection (traditional approach)
@Component({
  selector: 'app-traditional',
  template: '...'
})
export class TraditionalComponent {
  constructor(
    @Inject(APP_CONFIG) private config: AppConfig,
    @Inject(API_BASE_URL) private apiUrl: string,
    @Inject(FEATURE_FLAGS) private features: FeatureFlags
  ) {
    // Use injected values
  }
}

// Optional injection with fallback
@Component({
  selector: 'app-optional',
  template: '...'
})
export class OptionalComponent {
  private config = inject(APP_CONFIG, { optional: true });
  
  constructor() {
    if (this.config) {
      console.log('Config available:', this.config);
    } else {
      console.log('No config provided, using defaults');
    }
  }
}`,
      explanation: 'Different patterns for injecting and using tokens in components and services, including optional injection.'
    },
    {
      title: 'Testing with Injection Tokens',
      language: 'TypeScript',
      code: `// Testing component with mocked tokens
import { TestBed } from '@angular/core/testing';
import { APP_CONFIG, FEATURE_FLAGS } from './tokens';
import { ExampleComponent } from './example.component';

describe('ExampleComponent', () => {
  beforeEach(() => {
    const mockConfig = {
      apiBase: 'http://test-api.com',
      enableDebug: true,
      maxRetries: 1,
      timeout: 1000
    };
    
    const mockFeatures = {
      enableBetaFeatures: true,
      enableAnalytics: false,
      maxUploadSize: '1MB'
    };
    
    TestBed.configureTestingModule({
      imports: [ExampleComponent],
      providers: [
        { provide: APP_CONFIG, useValue: mockConfig },
        { provide: FEATURE_FLAGS, useValue: mockFeatures }
      ]
    });
  });
  
  it('should use mocked configuration', () => {
    const fixture = TestBed.createComponent(ExampleComponent);
    const component = fixture.componentInstance;
    
    expect(component.config.apiBase).toBe('http://test-api.com');
    expect(component.features.enableBetaFeatures).toBe(true);
  });
});

// Testing service with token dependencies
describe('ApiService', () => {
  let service: ApiService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApiService,
        { 
          provide: APP_CONFIG, 
          useValue: { 
            apiBase: 'http://mock-api.com',
            timeout: 500 
          } 
        }
      ]
    });
    
    service = TestBed.inject(ApiService);
  });
  
  it('should use mock configuration for API calls', () => {
    const spy = spyOn(service, 'makeRequest');
    service.getUsers();
    
    expect(spy).toHaveBeenCalledWith('http://mock-api.com/users');
  });
});

// Testing with different scenarios
const testScenarios = [
  {
    name: 'Development Environment',
    config: { apiBase: 'http://localhost:3000', enableDebug: true }
  },
  {
    name: 'Production Environment', 
    config: { apiBase: 'https://api.prod.com', enableDebug: false }
  }
];

testScenarios.forEach(scenario => {
  describe(\`Component in \${scenario.name}\`, () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: APP_CONFIG, useValue: scenario.config }
        ]
      });
    });
    
    it('should behave correctly', () => {
      // Test component behavior with this configuration
    });
  });
});`,
      explanation: 'Comprehensive testing patterns for components and services that use injection tokens, including scenario-based testing.'
    },
    {
      title: 'Advanced Token Patterns',
      language: 'TypeScript',
      code: `// Multi-provider tokens for plugin systems
export const PLUGIN_CONFIG = new InjectionToken<PluginConfig[]>('plugin.config');

// Register multiple plugins
const pluginProviders = [
  { provide: PLUGIN_CONFIG, useValue: authPluginConfig, multi: true },
  { provide: PLUGIN_CONFIG, useValue: analyticsPluginConfig, multi: true },
  { provide: PLUGIN_CONFIG, useValue: loggingPluginConfig, multi: true }
];

// Consume all plugin configs
@Injectable()
export class PluginManager {
  private plugins = inject(PLUGIN_CONFIG); // Array of all configs
  
  initializePlugins() {
    this.plugins.forEach(config => {
      console.log('Initializing plugin:', config.name);
      config.initialize();
    });
  }
}

// Hierarchical tokens for nested configurations
export const THEME_CONFIG = new InjectionToken<ThemeConfig>('theme.config');
export const USER_THEME_CONFIG = new InjectionToken<UserThemeConfig>('user.theme.config');

@Component({
  selector: 'app-themed-component',
  providers: [
    // Override theme for this component tree
    { 
      provide: USER_THEME_CONFIG, 
      useFactory: (baseTheme: ThemeConfig, userPrefs: UserPreferences) => ({
        ...baseTheme,
        ...userPrefs.theme
      }),
      deps: [THEME_CONFIG, UserPreferences]
    }
  ]
})
export class ThemedComponent {
  private theme = inject(USER_THEME_CONFIG);
}

// Token inheritance and composition
export const BASE_CONFIG = new InjectionToken<BaseConfig>('base.config');
export const EXTENDED_CONFIG = new InjectionToken<ExtendedConfig>('extended.config');

const configProviders = [
  { provide: BASE_CONFIG, useValue: baseConfigValues },
  {
    provide: EXTENDED_CONFIG,
    useFactory: (base: BaseConfig) => ({
      ...base,
      additionalFeatures: true,
      extendedSettings: {
        feature1: true,
        feature2: false
      }
    }),
    deps: [BASE_CONFIG]
  }
];

// Conditional token provision
function createConditionalProviders(environment: Environment) {
  const providers = [
    { provide: CORE_CONFIG, useValue: coreConfig }
  ];
  
  if (environment.production) {
    providers.push(
      { provide: ANALYTICS_CONFIG, useValue: productionAnalytics },
      { provide: MONITORING_CONFIG, useValue: productionMonitoring }
    );
  } else {
    providers.push(
      { provide: DEV_TOOLS_CONFIG, useValue: devToolsConfig },
      { provide: MOCK_CONFIG, useValue: mockConfig }
    );
  }
  
  return providers;
}`,
      explanation: 'Advanced patterns including multi-providers, hierarchical injection, token composition, and conditional provision strategies.'
    }
  ];

  // Explanation sections data
  explanationSections: ExplanationSection[] = [
    {
      title: 'What are Injection Tokens?',
      content: `Injection tokens are a way to create type-safe dependency injection for values that don't have runtime representation as classes. 
                They're perfect for configuration objects, primitive values, API URLs, feature flags, and any non-class dependencies. 
                Unlike services, tokens represent static values or configurations that components and services need to function.`
    },
    {
      title: 'Type Safety and Compile-time Checking',
      content: `The main advantage of InjectionToken is type safety. By providing generic type parameters, TypeScript can validate 
                at compile-time that you're injecting the correct type. This prevents runtime errors and provides excellent IDE support 
                with autocomplete and refactoring capabilities for your configuration objects.`
    },
    {
      title: 'Provider Strategies',
      content: `Tokens can be provided using different strategies: <code>useValue</code> for static values, <code>useFactory</code> for dynamic values 
                that need computation, and <code>useClass</code> when the token should resolve to a class instance. 
                Factory providers can have dependencies, allowing complex configuration scenarios.`
    },
    {
      title: 'Testing and Mocking',
      content: `Injection tokens excel in testing scenarios because they make it trivial to provide mock configurations. 
                You can easily test different scenarios by providing different token values, making your tests more focused 
                and reliable without complex setup or service mocking.`
    }
  ];

  // Pros and cons data
  prosConsData: ProsConsData = {
    title: '⚖️ Injection Tokens Analysis',
    pros: [
      { text: 'Compile-time type safety for injected values', highlight: true },
      { text: 'Excellent testing support with easy mocking' },
      { text: 'Environment-specific configuration support' },
      { text: 'No circular dependency issues' },
      { text: 'Tree-shaking friendly' },
      { text: 'Clear separation of configuration and logic' },
      { text: 'IDE support with autocomplete and refactoring' }
    ],
    cons: [
      { text: 'Learning curve for developers new to DI patterns', highlight: true },
      { text: 'Can create complex provider configurations' },
      { text: 'Requires understanding of Angular DI system' },
      { text: 'Token proliferation in large applications' },
      { text: 'Runtime errors if tokens not provided correctly' },
      { text: 'Less discoverable than class-based services' }
    ]
  };

  // Demo methods
  updateEnvironmentConfig() {
    switch (this.selectedEnvironment) {
      case 'development':
        this.demoConfig = {
          ...this.demoConfig,
          maxRetries: 1,
          timeout: 2000,
          theme: 'light',
          enableLogging: true
        };
        this.serviceExample = {
          baseUrl: 'https://api.development.com',
          timeout: 2000,
          retries: 1,
          debug: true
        };
        break;
      case 'staging':
        this.demoConfig = {
          ...this.demoConfig,
          maxRetries: 3,
          timeout: 5000,
          theme: 'auto',
          enableLogging: true
        };
        this.serviceExample = {
          baseUrl: 'https://api.staging.com',
          timeout: 5000,
          retries: 3,
          debug: true
        };
        break;
      case 'production':
        this.demoConfig = {
          ...this.demoConfig,
          maxRetries: 5,
          timeout: 10000,
          theme: 'dark',
          enableLogging: false
        };
        this.serviceExample = {
          baseUrl: 'https://api.production.com',
          timeout: 10000,
          retries: 5,
          debug: false
        };
        break;
    }
  }

  simulateApiCall() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.addLog('info', `Starting API call to ${this.serviceExample.baseUrl}`);
    this.addLog('info', `Using timeout: ${this.serviceExample.timeout}ms`);
    this.addLog('info', `Max retries: ${this.serviceExample.retries}`);
    
    if (this.serviceExample.debug) {
      this.addLog('info', 'Debug mode enabled - detailed logging active');
    }
    
    // Simulate API call delay
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate
      
      if (success) {
        this.addLog('info', 'API call completed successfully');
        this.addLog('info', 'Response received with 200 status');
      } else {
        this.addLog('warn', 'API call failed, attempting retry...');
        setTimeout(() => {
          this.addLog('error', 'All retries exhausted, API call failed');
          this.isLoading = false;
        }, 1000);
        return;
      }
      
      this.isLoading = false;
    }, 2000);
  }

  runTestScenario(scenario: TestScenario) {
    this.activeTestScenario = scenario.name;
    
    let output = `Testing scenario: ${scenario.name}\n`;
    output += `Description: ${scenario.description}\n\n`;
    
    if (scenario.mockConfig) {
      output += `Mock Configuration:\n`;
      output += JSON.stringify(scenario.mockConfig, null, 2);
      output += `\n\nTest Results:\n`;
      output += `✅ Token injection successful\n`;
      output += `✅ Configuration values accessible\n`;
      output += `✅ Type safety maintained\n`;
      output += `✅ Service functionality verified\n`;
    } else {
      output += `Mock Configuration: null\n\n`;
      output += `Test Results:\n`;
      output += `❌ Token injection failed\n`;
      output += `❌ Fallback configuration used\n`;
      output += `✅ Error handling working correctly\n`;
      output += `✅ Application remains stable\n`;
    }
    
    this.testResults = {
      scenario: scenario.name,
      output: output
    };
  }

  trackByLog(index: number, log: ApiLog): string {
    return `${log.timestamp.getTime()}-${log.level}`;
  }

  private addLog(level: 'info' | 'warn' | 'error', message: string) {
    this.apiLogs.unshift({
      timestamp: new Date(),
      message,
      level
    });
    
    // Keep only last 10 logs
    if (this.apiLogs.length > 10) {
      this.apiLogs = this.apiLogs.slice(0, 10);
    }
  }
}
