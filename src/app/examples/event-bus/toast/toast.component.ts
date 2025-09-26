import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { EventBusService } from '../event-bus.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnDestroy {
  msg = '';
  private sub: Subscription;
  
  constructor(private bus: EventBusService) {
    this.sub = this.bus.on<string>('toast').subscribe(message => {
      this.msg = message;
      setTimeout(() => this.msg = '', 3000); // Auto-hide after 3 seconds
    });
  }
  
  closeToast() {
    this.msg = '';
  }
  
  ngOnDestroy() { 
    this.sub.unsubscribe(); 
  }
}