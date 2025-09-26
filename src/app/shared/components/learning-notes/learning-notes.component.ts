import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface LearningNote {
  title: string;
  content: string;
  type: 'tip' | 'warning' | 'info';
}

@Component({
  selector: 'app-learning-notes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './learning-notes.component.html',
  styleUrls: ['./learning-notes.component.css']
})
export class LearningNotesComponent {
  @Input() notes: LearningNote[] = [];

  getIcon(type: string): string {
    switch (type) {
      case 'tip': return '💡';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📝';
    }
  }
}
