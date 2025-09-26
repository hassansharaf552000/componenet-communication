import { Component } from '@angular/core';
import { EventBusService } from '../event-bus.service';

@Component({
  selector: 'app-notify-button',
  standalone: true,
  templateUrl: './notify-button.component.html',
  styleUrls: ['./notify-button.component.css']
})
export class NotifyButtonComponent {
  constructor(private bus: EventBusService) {}
  
  notify() { 
    this.bus.emit({ 
      type: 'toast', 
      payload: 'Button clicked! Message sent via Event Bus 🚌' 
    }); 
  }
}