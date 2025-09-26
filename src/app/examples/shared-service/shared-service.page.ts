import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SenderComponent } from './sender';
import { ReceiverComponent } from './receiver';
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
  selector: 'app-shared-service-page',
  standalone: true,
  imports: [
    CommonModule,
    SenderComponent,
    ReceiverComponent,
    LearningNotesComponent,
    CodeExamplesComponent,
    ExplanationSectionComponent,
    ProsConsSectionComponent
  ],
  templateUrl: './shared-service.page.html',
  styleUrls: ['./shared-service.page.css']
})
export class SharedServicePageComponent {
  // Learning notes data
  learningNotes: LearningNote[] = [
    {
      title: 'Shared Service Pattern',
      content: 'Services act as intermediaries between components, enabling loose coupling and data sharing across component boundaries.',
      type: 'tip'
    },
    {
      title: 'RxJS Observables',
      content: 'Use observables to create reactive data streams that components can subscribe to for real-time updates.',
      type: 'info'
    },
    {
      title: 'Memory Leaks Prevention',
      content: 'Always unsubscribe from observables in ngOnDestroy to prevent memory leaks and unexpected behavior.',
      type: 'warning'
    },
    {
      title: 'Service Lifecycle',
      content: 'Services with providedIn: "root" are singletons shared across the entire application.',
      type: 'tip'
    }
  ];

  // Code examples data
  codeExamples: CodeExample[] = [
    {
      title: 'Message Service with RxJS',
      language: 'TypeScript',
      code: `import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  sender: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  private currentMessageSubject = new BehaviorSubject<Message | null>(null);

  // Public observables
  messages$ = this.messagesSubject.asObservable();
  currentMessage$ = this.currentMessageSubject.asObservable();

  sendMessage(content: string, sender: string) {
    const message: Message = {
      id: Date.now().toString(),
      content,
      timestamp: new Date(),
      sender
    };
    
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, message]);
    this.currentMessageSubject.next(message);
  }

  clearMessages() {
    this.messagesSubject.next([]);
    this.currentMessageSubject.next(null);
  }
}`,
      explanation: 'Complete message service using BehaviorSubject for state management and observable streams.'
    },
    {
      title: 'Sender Component',
      language: 'TypeScript',
      code: `import { Component } from '@angular/core';
import { MessageService } from './message.service';

@Component({
  selector: 'app-sender',
  template: \`
    <div class="sender-container">
      <h4>📤 Send Message</h4>
      <form (ngSubmit)="sendMessage()">
        <input 
          [(ngModel)]="messageText" 
          placeholder="Type your message..."
          required>
        <button type="submit" [disabled]="!messageText.trim()">
          Send Message
        </button>
      </form>
    </div>
  \`
})
export class SenderComponent {
  messageText = '';

  constructor(private messageService: MessageService) {}

  sendMessage() {
    if (this.messageText.trim()) {
      this.messageService.sendMessage(this.messageText, 'Sender');
      this.messageText = '';
    }
  }
}`,
      explanation: 'Sender component injects the service and calls sendMessage method to broadcast data.'
    },
    {
      title: 'Receiver Component with Subscription',
      language: 'TypeScript',
      code: `import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService, Message } from './message.service';

@Component({
  selector: 'app-receiver',
  template: \`
    <div class="receiver-container">
      <h4>📥 Received Messages</h4>
      <div *ngIf="currentMessage" class="current-message">
        <strong>Latest:</strong> {{ currentMessage.content }}
        <small>from {{ currentMessage.sender }}</small>
      </div>
      <div class="message-history">
        <div *ngFor="let message of messages" class="message">
          {{ message.content }}
          <span class="timestamp">{{ message.timestamp | date:'short' }}</span>
        </div>
      </div>
    </div>
  \`
})
export class ReceiverComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  currentMessage: Message | null = null;
  private subscriptions = new Subscription();

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    // Subscribe to message streams
    this.subscriptions.add(
      this.messageService.messages$.subscribe(messages => {
        this.messages = messages;
      })
    );

    this.subscriptions.add(
      this.messageService.currentMessage$.subscribe(message => {
        this.currentMessage = message;
      })
    );
  }

  ngOnDestroy() {
    // Clean up subscriptions
    this.subscriptions.unsubscribe();
  }
}`,
      explanation: 'Receiver component subscribes to observables and properly cleans up on destroy.'
    },
    {
      title: 'Advanced Service Patterns',
      language: 'TypeScript',
      code: `@Injectable({
  providedIn: 'root'
})
export class AdvancedMessageService {
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  
  // Filtered observables
  get errorMessages$() {
    return this.messages$.pipe(
      map(messages => messages.filter(m => m.type === 'error'))
    );
  }

  get recentMessages$() {
    return this.messages$.pipe(
      map(messages => messages.slice(-5))
    );
  }

  // Async operations
  async loadMessagesFromAPI(): Promise<Message[]> {
    try {
      const response = await fetch('/api/messages');
      const messages = await response.json();
      this.messagesSubject.next(messages);
      return messages;
    } catch (error) {
      console.error('Failed to load messages:', error);
      return [];
    }
  }

  // State management with reducers
  updateMessage(id: string, updates: Partial<Message>) {
    const current = this.messagesSubject.value;
    const updated = current.map(msg => 
      msg.id === id ? { ...msg, ...updates } : msg
    );
    this.messagesSubject.next(updated);
  }

  // Search functionality
  searchMessages(query: string): Observable<Message[]> {
    return this.messages$.pipe(
      map(messages => 
        messages.filter(m => 
          m.content.toLowerCase().includes(query.toLowerCase())
        )
      )
    );
  }
}`,
      explanation: 'Advanced patterns including filtered observables, async operations, and state management.'
    }
  ];

  // Explanation sections data
  explanationSections: ExplanationSection[] = [
    {
      title: 'How Shared Services Work',
      content: `Shared services act as a central hub for data and communication. Components inject the same service instance and can read from or write to shared state. The service uses RxJS observables to notify all subscribers when data changes, creating a reactive data flow.`
    },
    {
      title: 'Observable vs Subject',
      content: `<strong>Observable:</strong> Read-only stream for components to subscribe to data changes.<br>
                <strong>Subject:</strong> Internal stream that the service uses to emit new values.<br>
                <strong>BehaviorSubject:</strong> Special subject that stores the last emitted value and immediately provides it to new subscribers.`
    },
    {
      title: 'Subscription Management',
      content: `Always unsubscribe from observables in <code>ngOnDestroy</code> to prevent memory leaks. Use techniques like <code>takeUntil</code>, <code>Subscription.add()</code>, or the <code>async</code> pipe for automatic cleanup.`
    },
    {
      title: 'Service Scope and Providers',
      content: `Services with <code>providedIn: 'root'</code> are application-wide singletons. You can also provide services at component level for isolated instances, or use hierarchical injection for scoped services.`
    }
  ];

  // Pros and cons data
  prosConsData: ProsConsData = {
    title: '⚖️ Shared Service Analysis',
    pros: [
      { text: 'Enables communication between any components', highlight: true },
      { text: 'Reactive programming with RxJS observables' },
      { text: 'Centralized state management' },
      { text: 'Loose coupling between components' },
      { text: 'Scalable for complex applications' },
      { text: 'Easy to test with dependency injection' }
    ],
    cons: [
      { text: 'Requires subscription management', highlight: true },
      { text: 'Can lead to memory leaks if not handled properly' },
      { text: 'More complex setup than direct communication' },
      { text: 'Debugging can be challenging with multiple subscribers' },
      { text: 'RxJS learning curve for beginners' }
    ]
  };
}
