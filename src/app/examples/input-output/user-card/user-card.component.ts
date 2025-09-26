import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface User { 
  id: number; 
  name: string; 
  email: string; 
  role?: string 
}

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent {
  @Input({ required: true }) user!: User;
}