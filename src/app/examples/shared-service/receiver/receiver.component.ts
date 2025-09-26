import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-receiver',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './receiver.component.html',
  styleUrls: ['./receiver.component.css']
})
export class ReceiverComponent implements OnDestroy {
  message = '';
  messageHistory: string[] = [];
  private subscription: Subscription;
  
  constructor(private messageService: MessageService) {
    this.subscription = this.messageService.message$.subscribe(msg => {
      this.message = msg;
      if (msg && !this.messageHistory.includes(msg)) {
        this.messageHistory.push(msg);
      }
    });
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  
  clearHistory() {
    this.messageHistory = [];
  }
}