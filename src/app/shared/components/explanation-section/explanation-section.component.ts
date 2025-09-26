import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ExplanationSection {
  title: string;
  content: string;
  icon?: string;
}

@Component({
  selector: 'app-explanation-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './explanation-section.component.html',
  styleUrls: ['./explanation-section.component.css']
})
export class ExplanationSectionComponent {
  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() sections: ExplanationSection[] = [];
}
