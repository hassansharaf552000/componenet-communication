import { Component } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserCardComponent, User as ViewUser } from './user-card';
import { UserEditorComponent, User as EditUser } from './user-editor';
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
  selector: 'app-input-output-page',
  standalone: true,
  imports: [
    CommonModule,
    JsonPipe,
    FormsModule,
    UserCardComponent,
    UserEditorComponent,
    LearningNotesComponent,
    CodeExamplesComponent,
    ExplanationSectionComponent,
    ProsConsSectionComponent
  ],
  templateUrl: './input-output.page.html',
  styleUrls: ['./input-output.page.css']
})
export class InputOutputPageComponent {
  // Demo data for @Input
  users: ViewUser[] = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Developer' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Designer' },
    { id: 3, name: 'Carol Davis', email: 'carol@example.com', role: 'Manager' }
  ];

  // Demo data for @Output
  currentUser: EditUser = { id: 0, name: '', email: '', role: '' };
  allUsers: EditUser[] = [];

  // Learning notes data
  learningNotes: LearningNote[] = [
    {
      title: '@Input Decorator',
      content: 'Allows parent component to pass data to child component. Child receives data as properties.',
      type: 'tip'
    },
    {
      title: '@Output Decorator',
      content: 'Enables child component to emit events back to parent. Uses EventEmitter for communication.',
      type: 'info'
    },
    {
      title: 'OnChanges Lifecycle',
      content: 'Always implement OnChanges when using @Input to detect changes in input properties.',
      type: 'warning'
    },
    {
      title: 'Immutability',
      content: 'For better performance with OnPush strategy, use immutable data patterns when passing objects.',
      type: 'tip'
    }
  ];

  // Code examples data
  codeExamples: CodeExample[] = [
    {
      title: 'Parent Component Template',
      language: 'HTML',
      code: `<!-- Passing data to child with @Input -->
<app-user-card 
  [user]="selectedUser"
  [showDetails]="true"
  [theme]="'modern'">
</app-user-card>

<!-- Listening to child events with @Output -->
<app-user-editor 
  (userSaved)="onUserSaved($event)"
  (userCanceled)="onUserCanceled()">
</app-user-editor>`,
      explanation: 'Shows how parent passes data via property binding and listens to events via event binding.'
    },
    {
      title: 'Child Component with @Input',
      language: 'TypeScript',
      code: `export class UserCardComponent implements OnChanges {
  @Input() user!: User;
  @Input() showDetails: boolean = false;
  @Input() theme: string = 'default';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user']) {
      console.log('User data changed:', changes['user'].currentValue);
    }
  }
}`,
      explanation: 'Demonstrates input properties with different types and OnChanges implementation.'
    },
    {
      title: 'Child Component with @Output',
      language: 'TypeScript',
      code: `export class UserEditorComponent {
  @Output() userSaved = new EventEmitter<User>();
  @Output() userCanceled = new EventEmitter<void>();

  onSave() {
    if (this.isValid()) {
      this.userSaved.emit(this.user);
    }
  }

  onCancel() {
    this.userCanceled.emit();
  }
}`,
      explanation: 'Shows how to emit events back to parent component using EventEmitter.'
    },
    {
      title: 'Advanced Input Validation',
      language: 'TypeScript',
      code: `export class UserCardComponent {
  private _user: User | null = null;

  @Input() 
  set user(value: User | null) {
    if (value && this.isValidUser(value)) {
      this._user = value;
      this.processUser();
    }
  }
  
  get user(): User | null {
    return this._user;
  }

  private isValidUser(user: User): boolean {
    return user.name?.length > 0 && user.email?.includes('@');
  }
}`,
      explanation: 'Using setter/getter pattern for input validation and processing.'
    }
  ];

  // Explanation sections data
  explanationSections: ExplanationSection[] = [
    {
      title: 'How @Input Works',
      content: `The <code>@Input</code> decorator marks a class property as an input property, making it bindable from parent components. When the parent component changes the bound value, Angular automatically updates the child component's property. This creates a one-way data flow from parent to child.`
    },
    {
      title: 'How @Output Works', 
      content: `The <code>@Output</code> decorator marks a property as an output property that can emit events. It uses <code>EventEmitter</code> to send data from child to parent. When the child component calls <code>emit()</code>, the parent component receives the event through event binding.`
    },
    {
      title: 'Best Practices',
      content: `<strong>1. Use OnChanges:</strong> Implement <code>OnChanges</code> to react to input changes.<br>
                <strong>2. Immutable Data:</strong> Use immutable patterns for complex objects to optimize change detection.<br>
                <strong>3. Type Safety:</strong> Always type your inputs and outputs for better development experience.<br>
                <strong>4. Validation:</strong> Use setter methods to validate inputs before processing.`
    }
  ];

  // Pros and cons data
  prosConsData: ProsConsData = {
    title: '⚖️ @Input/@Output Analysis',
    pros: [
      { text: 'Simple and intuitive parent-child communication', highlight: true },
      { text: 'Type-safe with TypeScript support' },
      { text: 'Built-in change detection integration' },
      { text: 'Supports complex object passing' },
      { text: 'Event-driven architecture with @Output' }
    ],
    cons: [
      { text: 'Only works for direct parent-child relationships', highlight: true },
      { text: 'Can lead to prop drilling in deep hierarchies' },
      { text: 'Tight coupling between components' },
      { text: 'Manual change detection needed for complex scenarios' }
    ]
  };

  // Event handlers
  onUserSaved(user: EditUser) {
    this.allUsers.push({ ...user });
    this.currentUser = { id: 0, name: '', email: '', role: '' };
  }

  onUserCanceled() {
    this.currentUser = { id: 0, name: '', email: '', role: '' };
  }
}
