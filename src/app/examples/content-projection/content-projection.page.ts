import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card';
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

@Component({
  selector: 'app-content-projection-page',
  standalone: true,
  imports: [
    CardComponent,
    CommonModule,
    FormsModule,
    LearningNotesComponent,
    CodeExamplesComponent,
    ExplanationSectionComponent,
    ProsConsSectionComponent
  ],
  templateUrl: './content-projection.page.html',
  styleUrls: ['./content-projection.page.css']
})
export class ContentProjectionPageComponent {
  showHeader = true;
  showFooter = true;
  
  // Playground data
  playgroundHeader = 'Interactive Header';
  playgroundBody = 'Type your content here and see it projected in real-time!\n\nContent projection makes components flexible and reusable by allowing parent components to inject custom content.';
  playgroundFooter = 'Dynamic Footer';
  
  get currentTime(): string {
    return new Date().toLocaleTimeString();
  }

  // Learning notes data
  learningNotes: LearningNote[] = [
    {
      title: 'ng-content Basics',
      content: 'Use <ng-content> to create projection slots in child components. Content from parent is projected into these slots.',
      type: 'tip'
    },
    {
      title: 'Selector Attributes',
      content: 'Use select attribute with CSS selectors to create named slots: select="[header]", select=".footer", select="button"',
      type: 'info'
    },
    {
      title: 'Default Slot',
      content: 'ng-content without select attribute acts as the default slot for content without specific selectors.',
      type: 'tip'
    },
    {
      title: 'Content Projection Timing',
      content: 'Projected content is available after ngAfterContentInit lifecycle hook, not in ngOnInit.',
      type: 'warning'
    },
    {
      title: 'CSS Scoping',
      content: 'Projected content retains the styles from the parent component, which can sometimes lead to unexpected styling.',
      type: 'info'
    }
  ];

  // Code examples data
  codeExamples: CodeExample[] = [
    {
      title: 'Basic Content Projection',
      language: 'TypeScript',
      code: `// Card Component (Child) - Defines projection slots
@Component({
  selector: 'app-card',
  template: \`
    <div class="card">
      <!-- Named slot for header -->
      <ng-content select="[header]"></ng-content>
      
      <!-- Default slot for main content -->
      <div class="card-body">
        <ng-content></ng-content>
      </div>
      
      <!-- Named slot for footer -->
      <ng-content select="[footer]"></ng-content>
    </div>
  \`,
  styles: [\`
    .card {
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .card-body {
      padding: 1rem;
    }
  \`]
})
export class CardComponent {}

// Parent Component Usage
@Component({
  template: \`
    <app-card>
      <!-- Goes to header slot -->
      <div header class="card-header">
        <h3>Card Title</h3>
      </div>
      
      <!-- Goes to default slot -->
      <div class="card-content">
        <p>This is the main content area.</p>
      </div>
      
      <!-- Goes to footer slot -->
      <div footer class="card-footer">
        <button>Save</button>
        <button>Cancel</button>
      </div>
    </app-card>
  \`
})
export class ParentComponent {}`,
      explanation: 'Basic single and multi-slot content projection using ng-content with CSS selectors.'
    },
    {
      title: 'Advanced Selector Patterns',
      language: 'TypeScript',
      code: `// Advanced Content Projection Selectors
@Component({
  selector: 'app-advanced-card',
  template: \`
    <!-- Select by attribute -->
    <ng-content select="[slot=header]"></ng-content>
    
    <!-- Select by CSS class -->
    <ng-content select=".card-body"></ng-content>
    
    <!-- Select by element tag -->
    <ng-content select="footer"></ng-content>
    
    <!-- Select by complex selector -->
    <ng-content select="button.primary"></ng-content>
    
    <!-- Select by data attribute -->
    <ng-content select="[data-section='main']"></ng-content>
    
    <!-- Multiple selectors (comma-separated) -->
    <ng-content select="h1, h2, h3"></ng-content>
    
    <!-- Default fallback for unmatched content -->
    <ng-content></ng-content>
  \`
})
export class AdvancedCardComponent {}

// Usage examples with different selectors:
\`
<app-advanced-card>
  <!-- Attribute selector -->
  <div slot="header">Header content</div>
  
  <!-- Class selector -->
  <div class="card-body">Body content</div>
  
  <!-- Element selector -->
  <footer>Footer content</footer>
  
  <!-- Complex selector -->
  <button class="primary">Primary button</button>
  
  <!-- Data attribute selector -->
  <div data-section="main">Main section</div>
  
  <!-- Multiple selector match -->
  <h2>This will be projected to the h1,h2,h3 slot</h2>
  
  <!-- Default slot -->
  <p>This goes to the default slot</p>
</app-advanced-card>
\``,
      explanation: 'Advanced selector patterns for flexible content projection including attributes, classes, elements, and complex selectors.'
    },
    {
      title: 'Conditional Content Projection',
      language: 'TypeScript',
      code: `@Component({
  selector: 'app-flexible-card',
  template: \`
    <div class="card">
      <!-- Conditional header projection -->
      <div class="card-header" *ngIf="hasHeaderContent">
        <ng-content select="[header]"></ng-content>
      </div>
      
      <!-- Always present body -->
      <div class="card-body">
        <ng-content></ng-content>
      </div>
      
      <!-- Conditional footer projection -->
      <div class="card-footer" *ngIf="hasFooterContent">
        <ng-content select="[footer]"></ng-content>
      </div>
      
      <!-- Conditional actions -->
      <div class="card-actions" *ngIf="hasActions">
        <ng-content select=".action"></ng-content>
      </div>
    </div>
  \`
})
export class FlexibleCardComponent implements AfterContentInit {
  @ContentChildren('[header]') headerContent!: QueryList<ElementRef>;
  @ContentChildren('[footer]') footerContent!: QueryList<ElementRef>;
  @ContentChildren('.action') actionContent!: QueryList<ElementRef>;
  
  hasHeaderContent = false;
  hasFooterContent = false;
  hasActions = false;
  
  ngAfterContentInit() {
    // Check if content was projected
    this.hasHeaderContent = this.headerContent.length > 0;
    this.hasFooterContent = this.footerContent.length > 0;
    this.hasActions = this.actionContent.length > 0;
  }
}`,
      explanation: 'Conditional projection using ContentChildren to detect projected content and show/hide slots dynamically.'
    },
    {
      title: 'Content Projection with ngProjectAs',
      language: 'TypeScript',
      code: `// Component with complex projection needs
@Component({
  selector: 'app-layout',
  template: \`
    <header>
      <ng-content select="[slot=header]"></ng-content>
    </header>
    
    <aside class="sidebar">
      <ng-content select="[slot=sidebar]"></ng-content>
    </aside>
    
    <main>
      <ng-content select="[slot=main]"></ng-content>
    </main>
    
    <footer>
      <ng-content select="[slot=footer]"></ng-content>
    </footer>
  \`
})
export class LayoutComponent {}

// Parent component with ngProjectAs
@Component({
  template: \`
    <app-layout>
      <!-- Normal projection -->
      <div slot="header">
        <h1>My App</h1>
      </div>
      
      <!-- Using ngProjectAs to project to different slot -->
      <div class="navigation" ngProjectAs="[slot=sidebar]">
        <nav>
          <a href="/home">Home</a>
          <a href="/about">About</a>
        </nav>
      </div>
      
      <!-- Complex content with ngProjectAs -->
      <ng-container ngProjectAs="[slot=main]">
        <article>
          <h2>{{ title }}</h2>
          <p>{{ content }}</p>
        </article>
      </ng-container>
      
      <!-- Multiple elements projected as one -->
      <div ngProjectAs="[slot=footer]">
        <p>&copy; 2024 My Company</p>
        <div class="social-links">
          <a href="#">Twitter</a>
          <a href="#">GitHub</a>
        </div>
      </div>
    </app-layout>
  \`
})
export class AppComponent {
  title = 'Welcome to My App';
  content = 'This content is projected using ngProjectAs directive.';
}`,
      explanation: 'Using ngProjectAs to control how content is projected, especially useful for complex layouts and conditional content.'
    },
    {
      title: 'Content Projection Best Practices',
      language: 'TypeScript',
      code: `// Best practices for content projection
@Component({
  selector: 'app-best-practice-card',
  template: \`
    <div class="card" [class.has-header]="hasHeader" [class.has-footer]="hasFooter">
      <!-- Provide default content with ng-template -->
      <div class="card-header" *ngIf="hasHeader; else defaultHeader">
        <ng-content select="[header]"></ng-content>
      </div>
      
      <ng-template #defaultHeader>
        <div class="default-header">
          <h3>Default Title</h3>
        </div>
      </ng-template>
      
      <!-- Main content area -->
      <div class="card-body">
        <ng-content></ng-content>
      </div>
      
      <!-- Optional footer with fallback -->
      <div class="card-footer" *ngIf="hasFooter; else defaultFooter">
        <ng-content select="[footer]"></ng-content>
      </div>
      
      <ng-template #defaultFooter>
        <div class="default-footer">
          <small>No footer content provided</small>
        </div>
      </ng-template>
    </div>
  \`,
  styles: [\`
    .card {
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .card.has-header .card-body {
      border-top: 1px solid #eee;
    }
    
    .card.has-footer .card-body {
      border-bottom: 1px solid #eee;
    }
    
    .default-header,
    .default-footer {
      padding: 1rem;
      background: #f8f9fa;
      color: #6c757d;
      font-style: italic;
    }
  \`]
})
export class BestPracticeCardComponent implements AfterContentInit {
  @ContentChild('[header]') headerContent?: ElementRef;
  @ContentChild('[footer]') footerContent?: ElementRef;
  
  hasHeader = false;
  hasFooter = false;
  
  ngAfterContentInit() {
    this.hasHeader = !!this.headerContent;
    this.hasFooter = !!this.footerContent;
  }
}

// Usage patterns
\`
<!-- Minimal usage -->
<app-best-practice-card>
  <p>Just body content</p>
</app-best-practice-card>

<!-- Full usage -->
<app-best-practice-card>
  <div header>Custom Header</div>
  <p>Body content with custom header and footer</p>
  <div footer>Custom Footer</div>
</app-best-practice-card>
\``,
      explanation: 'Best practices including default content, conditional rendering, and proper lifecycle management for robust content projection.'
    }
  ];

  // Explanation sections data
  explanationSections: ExplanationSection[] = [
    {
      title: 'Content Projection Fundamentals',
      content: `Content projection is Angular's mechanism for creating flexible, reusable components through composition. 
                The <code>&lt;ng-content&gt;</code> directive acts as a placeholder where parent components can inject custom content. 
                This enables the creation of wrapper components that can display different content while maintaining consistent structure and styling.`
    },
    {
      title: 'Selector-Based Projection',
      content: `Angular supports multiple projection slots using CSS selectors in the <code>select</code> attribute. 
                You can target content by element name (<code>select="header"</code>), CSS class (<code>select=".footer"</code>), 
                attribute (<code>select="[data-role='content']"</code>), or complex selectors (<code>select="button.primary"</code>). 
                This allows precise control over where different pieces of content are rendered.`
    },
    {
      title: 'Lifecycle and Content Queries',
      content: `Projected content becomes available after the <code>ngAfterContentInit</code> lifecycle hook. 
                Use <code>@ContentChild</code> and <code>@ContentChildren</code> decorators to query projected content and 
                implement conditional rendering based on what content was actually provided. This enables dynamic layouts that adapt to available content.`
    },
    {
      title: 'Performance and Best Practices',
      content: `Content projection is highly performant as it doesn't create additional component instances. 
                Projected content retains its original context and styling from the parent component. 
                Always provide fallback content for optional slots, use semantic selectors, and consider content structure when designing projection-based components.`
    }
  ];

  // Pros and cons data
  prosConsData: ProsConsData = {
    title: '⚖️ Content Projection Analysis',
    pros: [
      { text: 'Highly flexible and reusable components', highlight: true },
      { text: 'Native Angular feature with excellent performance' },
      { text: 'Maintains parent context and styling' },
      { text: 'Supports complex composition patterns' },
      { text: 'Clean separation of structure and content' },
      { text: 'SEO-friendly content rendering' },
      { text: 'Type-safe with proper TypeScript integration' }
    ],
    cons: [
      { text: 'Learning curve for complex selector patterns', highlight: true },
      { text: 'Less explicit than property-based communication' },
      { text: 'Debugging projected content can be challenging' },
      { text: 'Limited parent-child data communication' },
      { text: 'CSS scoping can cause unexpected styling issues' },
      { text: 'Content availability only after ngAfterContentInit' }
    ]
  };
}
