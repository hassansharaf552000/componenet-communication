import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FocusInputComponent } from './focus-input';
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
  selector: 'app-view-child-page',
  standalone: true,
  imports: [
    CommonModule,
    FocusInputComponent,
    LearningNotesComponent,
    CodeExamplesComponent,
    ExplanationSectionComponent,
    ProsConsSectionComponent
  ],
  templateUrl: './view-child.page.html',
  styleUrls: ['./view-child.page.css']
})
export class ViewChildPageComponent {
  @ViewChild('childComponent') childComponent!: FocusInputComponent;
  
  childData: any = null;

  // Learning notes data
  learningNotes: LearningNote[] = [
    {
      title: '@ViewChild Decorator',
      content: 'Provides direct access to child component instance, allowing parent to call child methods and access properties.',
      type: 'tip'
    },
    {
      title: 'Template Reference Variables',
      content: 'Use template reference variables (like #childComponent) to identify which child component to access.',
      type: 'info'
    },
    {
      title: 'AfterViewInit Lifecycle',
      content: 'ViewChild references are only available after the view has been initialized. Use AfterViewInit lifecycle hook.',
      type: 'warning'
    },
    {
      title: 'Direct Coupling',
      content: 'ViewChild creates tight coupling between parent and child. Use sparingly for specific use cases.',
      type: 'warning'
    }
  ];

  // Code examples data
  codeExamples: CodeExample[] = [
    {
      title: 'Parent Component with @ViewChild',
      language: 'TypeScript',
      code: `import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { ChildComponent } from './child.component';

@Component({
  selector: 'app-parent',
  template: \`
    <app-child #childRef></app-child>
    <button (click)="callChildMethod()">Call Child</button>
  \`
})
export class ParentComponent implements AfterViewInit {
  @ViewChild('childRef') childComponent!: ChildComponent;
  
  ngAfterViewInit() {
    // ViewChild is now available
    console.log('Child component:', this.childComponent);
  }
  
  callChildMethod() {
    this.childComponent.doSomething();
  }
}`,
      explanation: 'Shows basic @ViewChild usage with template reference variable and AfterViewInit.'
    },
    {
      title: 'Multiple ViewChild References',
      language: 'TypeScript',
      code: `export class ParentComponent {
  @ViewChild('firstChild') firstChild!: ChildComponent;
  @ViewChild('secondChild') secondChild!: ChildComponent;
  @ViewChild(ChildComponent) anyChild!: ChildComponent;
  
  // Access by component type (gets first instance)
  @ViewChild(ChildComponent) child!: ChildComponent;
  
  // Access all instances
  @ViewChildren(ChildComponent) children!: QueryList<ChildComponent>;
  
  callAllChildren() {
    this.children.forEach(child => child.doSomething());
  }
}`,
      explanation: 'Demonstrates multiple ViewChild patterns and ViewChildren for accessing multiple instances.'
    },
    {
      title: 'ViewChild with ElementRef',
      language: 'TypeScript',
      code: `import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  template: \`
    <input #inputRef type="text" placeholder="Direct DOM access">
    <button (click)="focusInput()">Focus Input</button>
  \`
})
export class ComponentWithElementRef {
  @ViewChild('inputRef') inputElement!: ElementRef<HTMLInputElement>;
  
  focusInput() {
    this.inputElement.nativeElement.focus();
  }
  
  getValue(): string {
    return this.inputElement.nativeElement.value;
  }
  
  setValue(value: string) {
    this.inputElement.nativeElement.value = value;
  }
}`,
      explanation: 'Using ViewChild to access DOM elements directly via ElementRef.'
    },
    {
      title: 'Advanced ViewChild Patterns',
      language: 'TypeScript',
      code: `export class AdvancedParentComponent implements AfterViewInit {
  @ViewChild('dynamicChild', { read: ChildComponent }) child!: ChildComponent;
  @ViewChild('dynamicChild', { read: ElementRef }) childElement!: ElementRef;
  
  // Static queries (available in ngOnInit)
  @ViewChild('staticChild', { static: true }) staticChild!: ChildComponent;
  
  ngAfterViewInit() {
    // Dynamic child available here
    if (this.child) {
      this.child.initialize();
    }
  }
  
  // Accessing child properties
  getChildState() {
    return {
      value: this.child.currentValue,
      isValid: this.child.isValid(),
      metadata: this.child.getMetadata()
    };
  }
  
  // Programmatic child interaction
  updateChild(data: any) {
    this.child.updateData(data);
    this.child.refresh();
  }
}`,
      explanation: 'Advanced ViewChild patterns including static queries and multiple read options.'
    }
  ];

  // Explanation sections data
  explanationSections: ExplanationSection[] = [
    {
      title: 'How @ViewChild Works',
      content: `<code>@ViewChild</code> creates a direct reference from parent to child component. The parent can access all public properties and methods of the child component. This enables direct manipulation and data access, but creates tight coupling between components.`
    },
    {
      title: 'Template Reference Variables',
      content: `Template reference variables (like <code>#childRef</code>) are used to identify which child component or element to reference. The parent component can then use <code>@ViewChild('childRef')</code> to get a direct reference to that instance.`
    },
    {
      title: 'Lifecycle Considerations',
      content: `<code>@ViewChild</code> references are only available after the view has been initialized. Always use <code>AfterViewInit</code> lifecycle hook to ensure the reference is available before trying to access it.`
    },
    {
      title: 'When to Use ViewChild',
      content: `Use <code>@ViewChild</code> for: Direct DOM manipulation, Accessing child component methods, Imperative interactions, Form validation scenarios. Avoid for: Regular data passing (use @Input instead), Event communication (use @Output instead).`
    }
  ];

  // Pros and cons data
  prosConsData: ProsConsData = {
    title: '⚖️ @ViewChild Analysis',
    pros: [
      { text: 'Direct access to child methods and properties', highlight: true },
      { text: 'Enables imperative programming patterns' },
      { text: 'Perfect for DOM manipulation scenarios' },
      { text: 'No event emission overhead' },
      { text: 'Type-safe access to child components' }
    ],
    cons: [
      { text: 'Creates tight coupling between components', highlight: true },
      { text: 'Only available after view initialization' },
      { text: 'Harder to test and mock' },
      { text: 'Violates component encapsulation principles' },
      { text: 'Can make components less reusable' }
    ]
  };

  // Demo methods
  focusInput() {
    if (this.childComponent) {
      this.childComponent.focusInput();
    }
  }

  clearInput() {
    if (this.childComponent) {
      this.childComponent.clearInput();
    }
  }

  setInputValue() {
    if (this.childComponent) {
      this.childComponent.setValue('Hello from Parent! 👋');
    }
  }

  getInputData() {
    if (this.childComponent) {
      this.childData = {
        currentValue: this.childComponent.getValue(),
        isFocused: this.childComponent.isFocused,
        interactionCount: this.childComponent.getInteractionCount(),
        timestamp: new Date().toISOString()
      };
    }
  }
}
