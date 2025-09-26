import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-sender',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './sender.component.html',
  styleUrls: ['./sender.component.css']
})
export class SenderComponent {
  text = '';
  sentMessages: string[] = [];
  
  constructor(private messageService: MessageService) {}
  
  send() {
    if (this.text.trim()) {
      this.messageService.setMessage(this.text);
      this.sentMessages.push(this.text);
      this.text = '';
    }
  }
  
  clearHistory() {
    this.sentMessages = [];
  }
}