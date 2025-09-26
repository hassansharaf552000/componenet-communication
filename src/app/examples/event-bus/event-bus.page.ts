import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotifyButtonComponent } from './notify-button';
import { ToastComponent } from './toast';
import { EventBusService } from './event-bus.service';
import { Subscription } from 'rxjs';

interface EventLog {
  id: string;
  type: string;
  message: string;
  timestamp: Date;
  source: string;
}

@Component({
  selector: 'app-event-bus-page',
  standalone: true,
  imports: [NotifyButtonComponent, ToastComponent, CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>📡 RxJS Event Bus</h2>
        <p>Decoupled component communication via reactive streams</p>
      </div>

      <div class="concept-section">
        <h3>💡 Concept</h3>
        <p>
          Event Bus pattern uses RxJS Subjects to create a centralized communication 
          system where components can emit and listen to events without direct coupling. 
          Perfect for global notifications, cross-component updates, and loose coupling.
        </p>
      </div>

      <div class="demo-section">
        <h3>🎯 Live Demo</h3>
        
        <!-- Event Producers -->
        <div class="producers-section">
          <h4>📤 Event Producers</h4>
          <p>Components that emit events to the bus</p>
          
          <div class="producer-grid">
            <div class="producer-card">
              <h5>🔔 Notification System</h5>
              <app-notify-button></app-notify-button>
            </div>
            
            <div class="producer-card">
              <h5>📊 Manual Event Triggers</h5>
              <div class="manual-controls">
                <div class="control-group">
                  <label>Event Type:</label>
                  <select [(ngModel)]="selectedEventType">
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                
                <div class="control-group">
                  <label>Message:</label>
                  <input 
                    type="text" 
                    [(ngModel)]="customMessage" 
                    placeholder="Enter custom message..." 
                    maxlength="100" />
                </div>
                
                <button 
                  class="emit-btn" 
                  [class]="selectedEventType"
                  (click)="emitCustomEvent()">
                  📡 Emit {{ selectedEventType.toUpperCase() }} Event
                </button>
              </div>
            </div>
            
            <div class="producer-card">
              <h5>🎮 Batch Event Simulator</h5>
              <div class="batch-controls">
                <button class="batch-btn" (click)="simulateUserFlow()">
                  👤 Simulate User Flow
                </button>
                <button class="batch-btn" (click)="simulateErrorScenario()">
                  ⚠️ Simulate Error Scenario
                </button>
                <button class="batch-btn" (click)="simulateDataSync()">
                  🔄 Simulate Data Sync
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Event Consumers -->
        <div class="consumers-section">
          <h4>📥 Event Consumers</h4>
          <p>Components that listen and react to events</p>
          
          <div class="consumer-grid">
            <div class="consumer-card">
              <h5>🍞 Toast Notifications</h5>
              <app-toast></app-toast>
            </div>
            
            <div class="consumer-card">
              <h5>📊 Event Statistics</h5>
              <div class="stats-display">
                <div class="stat-item">
                  <span class="stat-label">Total Events:</span>
                  <span class="stat-value">{{ eventStats.total }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Info:</span>
                  <span class="stat-value info">{{ eventStats.info }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Success:</span>
                  <span class="stat-value success">{{ eventStats.success }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Warning:</span>
                  <span class="stat-value warning">{{ eventStats.warning }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Error:</span>
                  <span class="stat-value error">{{ eventStats.error }}</span>
                </div>
              </div>
            </div>
            
            <div class="consumer-card">
              <h5>📝 Live Event Monitor</h5>
              <div class="event-monitor">
                <div class="monitor-header">
                  <span>Real-time Event Stream</span>
                  <button class="clear-btn" (click)="clearEventLog()">🗑️ Clear</button>
                </div>
                <div class="event-stream" #eventStream>
                  <div 
                    *ngFor="let event of recentEvents; trackBy: trackByEventId" 
                    class="event-item"
                    [class]="event.type"
                    [@slideIn]>
                    <div class="event-time">{{ event.timestamp | date:'HH:mm:ss.SSS' }}</div>
                    <div class="event-type">{{ event.type.toUpperCase() }}</div>
                    <div class="event-message">{{ event.message }}</div>
                    <div class="event-source">{{ event.source }}</div>
                  </div>
                  <div *ngIf="recentEvents.length === 0" class="no-events">
                    No events yet. Try triggering some events above! 👆
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Event Flow Visualization -->
        <div class="flow-section">
          <h4>🔄 Event Flow Visualization</h4>
          <div class="flow-diagram">
            <div class="flow-step producer">
              <div class="flow-icon">📤</div>
              <div class="flow-label">Producer</div>
              <div class="flow-description">Emits events</div>
            </div>
            
            <div class="flow-arrow">
              <div class="arrow-line" [class.active]="isEventFlowing"></div>
              <div class="arrow-head" [class.active]="isEventFlowing">→</div>
            </div>
            
            <div class="flow-step bus">
              <div class="flow-icon">🚌</div>
              <div class="flow-label">Event Bus</div>
              <div class="flow-description">Routes events</div>
            </div>
            
            <div class="flow-arrow">
              <div class="arrow-line" [class.active]="isEventFlowing"></div>
              <div class="arrow-head" [class.active]="isEventFlowing">→</div>
            </div>
            
            <div class="flow-step consumer">
              <div class="flow-icon">📥</div>
              <div class="flow-label">Consumer</div>
              <div class="flow-description">Handles events</div>
            </div>
          </div>
        </div>

        <!-- Performance Metrics -->
        <div class="metrics-section">
          <h4>⚡ Performance Metrics</h4>
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-icon">📈</div>
              <div class="metric-content">
                <h5>Events/Second</h5>
                <span class="metric-value">{{ eventsPerSecond.toFixed(1) }}</span>
              </div>
            </div>
            
            <div class="metric-card">
              <div class="metric-icon">⏱️</div>
              <div class="metric-content">
                <h5>Avg Processing Time</h5>
                <span class="metric-value">{{ avgProcessingTime.toFixed(2) }}ms</span>
              </div>
            </div>
            
            <div class="metric-card">
              <div class="metric-icon">👥</div>
              <div class="metric-content">
                <h5>Active Subscribers</h5>
                <span class="metric-value">{{ activeSubscribers }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="code-section">
        <h3>💻 Code Examples</h3>
        
        <div class="code-tabs">
          <div class="code-tab active">Event Bus Service</div>
        </div>
        
        <pre class="code-block"><code>{{eventBusServiceCode}}</code></pre>
        
        <div class="code-tabs">
          <div class="code-tab active">Producer Component</div>
        </div>
        
        <pre class="code-block"><code>{{producerComponentCode}}</code></pre>
        
        <div class="code-tabs">
          <div class="code-tab active">Consumer Component</div>
        </div>
        
        <pre class="code-block"><code>{{consumerComponentCode}}</code></pre>
        
        <div class="code-tabs">
          <div class="code-tab active">Type-Safe Events</div>
        </div>
        
        <pre class="code-block"><code>{{typeSafeEventsCode}}</code></pre>
      </div>

      <div class="explanation-section">
        <h3>📚 Understanding Event Bus Pattern</h3>
        <div class="explanation-grid">
          <div class="explanation-item">
            <h4>📡 Event Bus Service</h4>
            <p>
              Centralized service using RxJS Subjects to manage event distribution. 
              Acts as a mediator between publishers and subscribers.
            </p>
            <ul>
              <li>Centralized event management</li>
              <li>Loose coupling between components</li>
              <li>Observable-based communication</li>
              <li>Type-safe event definitions</li>
            </ul>
          </div>
          
          <div class="explanation-item">
            <h4>📤 Event Producers</h4>
            <p>
              Components that emit events to the bus without knowing who 
              will consume them. Promotes decoupled architecture.
            </p>
            <ul>
              <li>Emit events via service</li>
              <li>No direct component coupling</li>
              <li>Flexible event payloads</li>
              <li>Conditional event emission</li>
            </ul>
          </div>
          
          <div class="explanation-item">
            <h4>📥 Event Consumers</h4>
            <p>
              Components that subscribe to specific events and react accordingly. 
              Can filter, transform, and combine event streams.
            </p>
            <ul>
              <li>Subscribe to relevant events</li>
              <li>Filter event streams</li>
              <li>Transform event data</li>
              <li>Unsubscribe on destroy</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="pros-cons-section">
        <div class="pros">
          <h4>✅ Pros</h4>
          <ul>
            <li>Excellent decoupling</li>
            <li>Reactive programming benefits</li>
            <li>Easy to test components</li>
            <li>Flexible event filtering</li>
            <li>Cross-cutting concerns</li>
            <li>Observable composition</li>
          </ul>
        </div>
        <div class="cons">
          <h4>❌ Cons</h4>
          <ul>
            <li>Memory leaks if not unsubscribed</li>
            <li>Harder to debug event flow</li>
            <li>Potential performance overhead</li>
            <li>Event naming conventions needed</li>
            <li>Complex error handling</li>
            <li>Learning curve for RxJS</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      animation: pageSlideIn 0.6s ease-out;
    }
    
    .page-header {
      text-align: center;
      margin-bottom: 3rem;
      
      h2 {
        font-size: 2.5rem;
        color: #2c3e50;
        margin: 0 0 1rem;
        background: linear-gradient(135deg, #e74c3c, #c0392b);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      p {
        font-size: 1.2rem;
        color: #7f8c8d;
        margin: 0;
      }
    }
    
    .concept-section {
      background: linear-gradient(135deg, #f8f9fa, #e9ecef);
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 2rem;
      border-left: 5px solid #e74c3c;
      
      h3 {
        color: #2c3e50;
        margin: 0 0 1rem;
        font-size: 1.5rem;
      }
      
      p {
        color: #34495e;
        line-height: 1.6;
        margin: 0;
        font-size: 1.1rem;
      }
    }
    
    .demo-section {
      margin-bottom: 3rem;
      
      h3 {
        color: #2c3e50;
        font-size: 1.8rem;
        margin-bottom: 1.5rem;
      }
    }
    
    .producers-section, .consumers-section {
      margin-bottom: 3rem;
      
      h4 {
        color: #e74c3c;
        margin: 0 0 0.5rem;
        font-size: 1.3rem;
      }
      
      p {
        color: #7f8c8d;
        margin: 0 0 1.5rem;
        font-style: italic;
      }
    }
    
    .producer-grid, .consumer-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    
    .producer-card, .consumer-card {
      background: linear-gradient(135deg, #ffffff, #f8f9fa);
      border-radius: 12px;
      padding: 1.5rem;
      border: 2px solid #e9ecef;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(231, 76, 60, 0.2);
        border-color: #e74c3c;
      }
      
      h5 {
        color: #e74c3c;
        margin: 0 0 1rem;
        font-size: 1.1rem;
        font-weight: 600;
      }
    }
    
    .manual-controls {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .control-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      
      label {
        color: #2c3e50;
        font-weight: 600;
        font-size: 0.9rem;
      }
      
      select, input {
        padding: 0.75rem;
        border: 2px solid #e9ecef;
        border-radius: 8px;
        background: white;
        color: #2c3e50;
        font-weight: 600;
        transition: border-color 0.3s ease;
        
        &:focus {
          outline: none;
          border-color: #e74c3c;
        }
      }
    }
    
    .emit-btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-top: 0.5rem;
      
      &.info {
        background: #3498db;
        color: white;
        &:hover { background: #2980b9; }
      }
      
      &.success {
        background: #27ae60;
        color: white;
        &:hover { background: #229954; }
      }
      
      &.warning {
        background: #f39c12;
        color: white;
        &:hover { background: #e67e22; }
      }
      
      &.error {
        background: #e74c3c;
        color: white;
        &:hover { background: #c0392b; }
      }
    }
    
    .batch-controls {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .batch-btn {
      background: linear-gradient(135deg, #e74c3c, #c0392b);
      color: white;
      border: none;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
      }
    }
    
    .stats-display {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .stat-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 1rem;
      background: #f8f9fa;
      border-radius: 6px;
      border-left: 4px solid #e9ecef;
      
      .stat-label {
        color: #7f8c8d;
        font-weight: 600;
      }
      
      .stat-value {
        font-weight: 600;
        font-size: 1.1rem;
        
        &.info { color: #3498db; }
        &.success { color: #27ae60; }
        &.warning { color: #f39c12; }
        &.error { color: #e74c3c; }
      }
    }
    
    .event-monitor {
      background: #2c3e50;
      border-radius: 8px;
      overflow: hidden;
      
      .monitor-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: #34495e;
        color: white;
        font-weight: 600;
        
        .clear-btn {
          background: #e74c3c;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: background 0.3s ease;
          
          &:hover {
            background: #c0392b;
          }
        }
      }
      
      .event-stream {
        max-height: 300px;
        overflow-y: auto;
        padding: 1rem;
        
        .event-item {
          display: grid;
          grid-template-columns: auto auto 1fr auto;
          gap: 1rem;
          padding: 0.75rem;
          margin-bottom: 0.5rem;
          border-radius: 6px;
          font-size: 0.9rem;
          animation: eventSlideIn 0.3s ease-out;
          
          &.info { background: rgba(52, 152, 219, 0.2); }
          &.success { background: rgba(39, 174, 96, 0.2); }
          &.warning { background: rgba(243, 156, 18, 0.2); }
          &.error { background: rgba(231, 76, 60, 0.2); }
          
          .event-time {
            color: #95a5a6;
            font-family: monospace;
            white-space: nowrap;
          }
          
          .event-type {
            font-weight: 600;
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
            white-space: nowrap;
            
            .info & { background: #3498db; color: white; }
            .success & { background: #27ae60; color: white; }
            .warning & { background: #f39c12; color: white; }
            .error & { background: #e74c3c; color: white; }
          }
          
          .event-message {
            color: #ecf0f1;
            flex: 1;
          }
          
          .event-source {
            color: #bdc3c7;
            font-size: 0.8rem;
            white-space: nowrap;
          }
        }
        
        .no-events {
          text-align: center;
          color: #95a5a6;
          padding: 2rem;
          font-style: italic;
        }
      }
    }
    
    .flow-section {
      margin-bottom: 2rem;
      
      h4 {
        color: #e74c3c;
        margin: 0 0 1.5rem;
        font-size: 1.3rem;
      }
    }
    
    .flow-diagram {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2rem;
      padding: 2rem;
      background: linear-gradient(135deg, #ffffff, #f8f9fa);
      border-radius: 12px;
      border: 2px solid #e9ecef;
      flex-wrap: wrap;
    }
    
    .flow-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      min-width: 120px;
      
      .flow-icon {
        font-size: 3rem;
        margin-bottom: 0.5rem;
        animation: flowIconFloat 3s ease-in-out infinite;
      }
      
      .flow-label {
        font-weight: 600;
        color: #2c3e50;
        margin-bottom: 0.25rem;
      }
      
      .flow-description {
        font-size: 0.9rem;
        color: #7f8c8d;
      }
      
      &.producer .flow-icon { animation-delay: 0s; }
      &.bus .flow-icon { animation-delay: 1s; }
      &.consumer .flow-icon { animation-delay: 2s; }
    }
    
    .flow-arrow {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      .arrow-line {
        width: 40px;
        height: 3px;
        background: #bdc3c7;
        transition: all 0.3s ease;
        
        &.active {
          background: #e74c3c;
          animation: arrowFlow 1s ease-in-out infinite;
        }
      }
      
      .arrow-head {
        font-size: 1.5rem;
        color: #bdc3c7;
        transition: color 0.3s ease;
        
        &.active {
          color: #e74c3c;
          animation: arrowPulse 1s ease-in-out infinite;
        }
      }
    }
    
    .metrics-section {
      margin-bottom: 2rem;
      
      h4 {
        color: #e74c3c;
        margin: 0 0 1.5rem;
        font-size: 1.3rem;
      }
    }
    
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }
    
    .metric-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      background: linear-gradient(135deg, #fdeeee, #fcd9d9);
      border-radius: 8px;
      border: 2px solid #f5b7b1;
      
      .metric-icon {
        font-size: 2.5rem;
        animation: metricPulse 2s ease-in-out infinite;
      }
      
      .metric-content {
        flex: 1;
        
        h5 {
          color: #e74c3c;
          margin: 0 0 0.5rem;
          font-size: 1rem;
        }
        
        .metric-value {
          color: #2c3e50;
          font-weight: 600;
          font-size: 1.5rem;
        }
      }
    }
    
    .code-section, .explanation-section {
      margin-bottom: 3rem;
      
      h3 {
        color: #2c3e50;
        font-size: 1.8rem;
        margin-bottom: 1.5rem;
      }
    }
    
    .code-tabs {
      display: flex;
      margin-bottom: 0;
      
      .code-tab {
        background: #34495e;
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 8px 8px 0 0;
        font-weight: 600;
        
        &.active {
          background: #2c3e50;
        }
      }
    }
    
    .code-block {
      background: #2c3e50;
      color: #ecf0f1;
      padding: 1.5rem;
      border-radius: 0 8px 8px 8px;
      overflow-x: auto;
      margin: 0 0 1rem;
      font-family: 'Courier New', monospace;
      font-size: 0.9rem;
      line-height: 1.6;
      
      code {
        color: inherit;
        background: none;
      }
    }
    
    .explanation-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    
    .explanation-item {
      background: linear-gradient(135deg, #ffffff, #f8f9fa);
      border-radius: 12px;
      padding: 1.5rem;
      border: 2px solid #e9ecef;
      transition: transform 0.3s ease;
      
      &:hover {
        transform: translateY(-5px);
        border-color: #e74c3c;
      }
      
      h4 {
        color: #e74c3c;
        margin: 0 0 1rem;
        font-size: 1.2rem;
      }
      
      p {
        color: #34495e;
        line-height: 1.6;
        margin: 0 0 1rem;
      }
      
      ul {
        margin: 0;
        padding-left: 1.2rem;
        
        li {
          color: #7f8c8d;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }
      }
      
      code {
        background: rgba(231, 76, 60, 0.1);
        padding: 0.2rem 0.4rem;
        border-radius: 4px;
        font-family: 'Courier New', monospace;
        color: #e74c3c;
        font-weight: 600;
      }
    }
    
    .pros-cons-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }
    
    .pros, .cons {
      padding: 1.5rem;
      border-radius: 12px;
      
      h4 {
        margin: 0 0 1rem;
        font-size: 1.2rem;
      }
      
      ul {
        margin: 0;
        padding-left: 1.5rem;
        
        li {
          margin-bottom: 0.5rem;
          line-height: 1.5;
        }
      }
    }
    
    .pros {
      background: linear-gradient(135deg, #e8f5e8, #d4edda);
      border-left: 5px solid #27ae60;
      
      h4 { color: #27ae60; }
      li { color: #2d5016; }
    }
    
    .cons {
      background: linear-gradient(135deg, #ffeaa7, #fdcb6e);
      border-left: 5px solid #f39c12;
      
      h4 { color: #f39c12; }
      li { color: #8b4513; }
    }
    
    @keyframes pageSlideIn {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes eventSlideIn {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    @keyframes flowIconFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    
    @keyframes arrowFlow {
      0% { background-position: 0 0; }
      100% { background-position: 20px 0; }
    }
    
    @keyframes arrowPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }
    
    @keyframes metricPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
  `]
})
export class EventBusPageComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  
  selectedEventType = 'info';
  customMessage = '';
  
  eventStats = {
    total: 0,
    info: 0,
    success: 0,
    warning: 0,
    error: 0
  };
  
  recentEvents: EventLog[] = [];
  isEventFlowing = false;
  
  eventsPerSecond = 0;
  avgProcessingTime = 0;
  activeSubscribers = 3; // Toast, Stats, Monitor
  
  private eventTimestamps: number[] = [];
  private processingTimes: number[] = [];

  constructor(private eventBus: EventBusService) {}

  ngOnInit() {
    this.subscribeToEvents();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private subscribeToEvents() {
    this.subscriptions.add(
      this.eventBus.on<any>('info').subscribe(payload => {
        this.handleEvent({ type: 'info', ...payload });
      })
    );
    
    this.subscriptions.add(
      this.eventBus.on<any>('success').subscribe(payload => {
        this.handleEvent({ type: 'success', ...payload });
      })
    );
    
    this.subscriptions.add(
      this.eventBus.on<any>('warning').subscribe(payload => {
        this.handleEvent({ type: 'warning', ...payload });
      })
    );
    
    this.subscriptions.add(
      this.eventBus.on<any>('error').subscribe(payload => {
        this.handleEvent({ type: 'error', ...payload });
      })
    );
  }

  private handleEvent(event: any) {
    const startTime = performance.now();
    
    // Update statistics
    this.eventStats.total++;
    this.eventStats[event.type as keyof typeof this.eventStats]++;
    
    // Add to recent events
    const eventLog: EventLog = {
      id: `${Date.now()}-${Math.random()}`,
      type: event.type,
      message: event.message,
      timestamp: new Date(),
      source: event.source || 'Unknown'
    };
    
    this.recentEvents.unshift(eventLog);
    if (this.recentEvents.length > 50) {
      this.recentEvents = this.recentEvents.slice(0, 50);
    }
    
    // Update flow animation
    this.isEventFlowing = true;
    setTimeout(() => {
      this.isEventFlowing = false;
    }, 1000);
    
    // Update performance metrics
    const endTime = performance.now();
    const processingTime = endTime - startTime;
    this.processingTimes.push(processingTime);
    if (this.processingTimes.length > 100) {
      this.processingTimes = this.processingTimes.slice(-100);
    }
    
    this.eventTimestamps.push(Date.now());
    if (this.eventTimestamps.length > 100) {
      this.eventTimestamps = this.eventTimestamps.slice(-100);
    }
    
    this.updateMetrics();
  }

  private updateMetrics() {
    // Calculate events per second
    const now = Date.now();
    const recentTimestamps = this.eventTimestamps.filter(
      timestamp => now - timestamp < 1000
    );
    this.eventsPerSecond = recentTimestamps.length;
    
    // Calculate average processing time
    if (this.processingTimes.length > 0) {
      this.avgProcessingTime = this.processingTimes.reduce((a, b) => a + b, 0) / this.processingTimes.length;
    }
  }

  emitCustomEvent() {
    if (!this.customMessage.trim()) {
      this.customMessage = `Sample ${this.selectedEventType} message`;
    }
    
    this.eventBus.emit({
      type: this.selectedEventType,
      payload: {
        message: this.customMessage,
        source: 'Manual Trigger',
        timestamp: new Date(),
        data: {
          triggeredBy: 'user',
          customData: true
        }
      }
    });
    
    this.customMessage = '';
  }

  simulateUserFlow() {
    const events = [
      { message: '👤 User logged in', source: 'Auth System' },
      { message: '📊 Dashboard loaded', source: 'Dashboard' },
      { message: '📄 Profile viewed', source: 'Profile Page' },
      { message: '💾 Settings updated', source: 'Settings' },
      { message: '🚪 User logged out', source: 'Auth System' }
    ];
    
    const types = ['info', 'success', 'info', 'success', 'info'];
    
    events.forEach((event, index) => {
      setTimeout(() => {
        this.eventBus.emit({
          type: types[index],
          payload: event
        });
      }, index * 800);
    });
  }

  simulateErrorScenario() {
    const events = [
      { message: '⚠️ API response slow', source: 'API Gateway' },
      { message: '❌ Database connection failed', source: 'Database' },
      { message: '🔄 Retrying connection...', source: 'Retry Logic' },
      { message: '💥 Service unavailable', source: 'Service Monitor' },
      { message: '🛠️ Fallback mode activated', source: 'Fallback System' }
    ];
    
    const types = ['warning', 'error', 'warning', 'error', 'info'];
    
    events.forEach((event, index) => {
      setTimeout(() => {
        this.eventBus.emit({
          type: types[index],
          payload: event
        });
      }, index * 600);
    });
  }

  simulateDataSync() {
    const events = [
      { message: '🔄 Data sync started', source: 'Sync Service' },
      { message: '📥 Fetching remote changes', source: 'Remote API' },
      { message: '⚠️ Conflict detected', source: 'Conflict Resolver' },
      { message: '✅ Conflicts resolved', source: 'Merge Engine' },
      { message: '💾 Data sync completed', source: 'Sync Service' }
    ];
    
    const types = ['info', 'info', 'warning', 'success', 'success'];
    
    events.forEach((event, index) => {
      setTimeout(() => {
        this.eventBus.emit({
          type: types[index],
          payload: event
        });
      }, index * 700);
    });
  }

  clearEventLog() {
    this.recentEvents = [];
    this.eventStats = {
      total: 0,
      info: 0,
      success: 0,
      warning: 0,
      error: 0
    };
  }

  trackByEventId(index: number, event: EventLog): string {
    return event.id;
  }

  eventBusServiceCode = `// event-bus.service.ts
import { Injectable } from '@angular/core';
import { Subject, Observable, filter } from 'rxjs';

export interface BusEvent {
  type: string;
  message: string;
  source?: string;
  timestamp?: Date;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  private eventSubject = new Subject<BusEvent>();
  
  // Public observable for all events
  public events$ = this.eventSubject.asObservable();
  
  // Emit an event to the bus
  emit(event: BusEvent): void {
    this.eventSubject.next({
      ...event,
      timestamp: event.timestamp || new Date()
    });
  }
  
  // Listen to specific event types
  on(eventType: string): Observable<BusEvent> {
    return this.events$.pipe(
      filter(event => event.type === eventType)
    );
  }
  
  // Listen to multiple event types
  onAny(eventTypes: string[]): Observable<BusEvent> {
    return this.events$.pipe(
      filter(event => eventTypes.includes(event.type))
    );
  }
  
  // Convenience methods for common event types
  emitInfo(message: string, source?: string, data?: any): void {
    this.emit({ type: 'info', message, source, data });
  }
  
  emitSuccess(message: string, source?: string, data?: any): void {
    this.emit({ type: 'success', message, source, data });
  }
  
  emitWarning(message: string, source?: string, data?: any): void {
    this.emit({ type: 'warning', message, source, data });
  }
  
  emitError(message: string, source?: string, data?: any): void {
    this.emit({ type: 'error', message, source, data });
  }
}`;

  producerComponentCode = `// Producer Component Example
import { Component } from '@angular/core';
import { EventBusService } from './event-bus.service';

@Component({
  selector: 'app-notification-sender',
  template: \`
    <div class="sender">
      <h3>Send Notifications</h3>
      
      <button (click)="sendInfo()">
        📘 Send Info
      </button>
      
      <button (click)="sendSuccess()">
        ✅ Send Success
      </button>
      
      <button (click)="sendWarning()">
        ⚠️ Send Warning
      </button>
      
      <button (click)="sendError()">
        ❌ Send Error
      </button>
    </div>
  \`
})
export class NotificationSenderComponent {
  constructor(private eventBus: EventBusService) {}
  
  sendInfo() {
    this.eventBus.emitInfo(
      'This is an informational message',
      'NotificationSender'
    );
  }
  
  sendSuccess() {
    this.eventBus.emitSuccess(
      'Operation completed successfully!',
      'NotificationSender',
      { operation: 'user_update', userId: 123 }
    );
  }
  
  sendWarning() {
    this.eventBus.emitWarning(
      'Please review your settings',
      'NotificationSender'
    );
  }
  
  sendError() {
    this.eventBus.emitError(
      'Something went wrong!',
      'NotificationSender',
      { errorCode: 500, details: 'Server error' }
    );
  }
  
  // Event can be triggered by any action
  onUserAction() {
    this.eventBus.emit({
      type: 'user_action',
      message: 'User performed an action',
      source: 'UserInterface',
      data: {
        action: 'button_click',
        timestamp: Date.now()
      }
    });
  }
}`;

  consumerComponentCode = `// Consumer Component Example
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventBusService } from './event-bus.service';

@Component({
  selector: 'app-notification-display',
  template: \`
    <div class="notifications">
      <h3>Notifications</h3>
      
      <div 
        *ngFor="let notification of notifications" 
        class="notification"
        [class]="notification.type">
        <strong>{{ notification.type.toUpperCase() }}:</strong>
        {{ notification.message }}
        <small>from {{ notification.source }}</small>
      </div>
    </div>
  \`
})
export class NotificationDisplayComponent implements OnInit, OnDestroy {
  notifications: any[] = [];
  private subscription = new Subscription();
  
  constructor(private eventBus: EventBusService) {}
  
  ngOnInit() {
    // Listen to all notification events
    this.subscription.add(
      this.eventBus.onAny(['info', 'success', 'warning', 'error'])
        .subscribe(event => {
          this.addNotification(event);
        })
    );
    
    // Listen to specific events
    this.subscription.add(
      this.eventBus.on('user_action')
        .subscribe(event => {
          console.log('User action detected:', event);
        })
    );
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  
  private addNotification(event: any) {
    this.notifications.unshift(event);
    
    // Auto-remove notifications after 5 seconds
    setTimeout(() => {
      const index = this.notifications.indexOf(event);
      if (index > -1) {
        this.notifications.splice(index, 1);
      }
    }, 5000);
  }
}`;

  typeSafeEventsCode = `// Type-safe event system
export interface AppEvents {
  user_login: { userId: string; timestamp: Date };
  user_logout: { userId: string; sessionDuration: number };
  data_updated: { entity: string; id: string; changes: any };
  error_occurred: { error: Error; context: string };
  notification_sent: { recipient: string; type: string };
}

export type EventType = keyof AppEvents;
export type EventPayload<T extends EventType> = AppEvents[T];

// Type-safe event bus service
@Injectable({
  providedIn: 'root'
})
export class TypedEventBusService {
  private eventSubject = new Subject<{
    type: EventType;
    payload: EventPayload<any>;
    timestamp: Date;
  }>();
  
  public events$ = this.eventSubject.asObservable();
  
  // Type-safe emit method
  emit<T extends EventType>(
    type: T, 
    payload: EventPayload<T>
  ): void {
    this.eventSubject.next({
      type,
      payload,
      timestamp: new Date()
    });
  }
  
  // Type-safe listener
  on<T extends EventType>(eventType: T): Observable<{
    type: T;
    payload: EventPayload<T>;
    timestamp: Date;
  }> {
    return this.events$.pipe(
      filter(event => event.type === eventType)
    ) as any;
  }
}

// Usage example
export class UserService {
  constructor(private eventBus: TypedEventBusService) {}
  
  login(userId: string) {
    // TypeScript will enforce correct payload structure
    this.eventBus.emit('user_login', {
      userId,
      timestamp: new Date()
    });
  }
  
  updateData(entity: string, id: string, changes: any) {
    this.eventBus.emit('data_updated', {
      entity,
      id,
      changes
    });
  }
}

export class NotificationComponent implements OnInit {
  constructor(private eventBus: TypedEventBusService) {}
  
  ngOnInit() {
    // Type-safe subscription
    this.eventBus.on('user_login').subscribe(event => {
      // event.payload is typed as { userId: string; timestamp: Date }
      console.log(\`User \${event.payload.userId} logged in\`);
    });
    
    this.eventBus.on('data_updated').subscribe(event => {
      // event.payload is typed correctly
      console.log(\`\${event.payload.entity} updated\`);
    });
  }
}`;
}
