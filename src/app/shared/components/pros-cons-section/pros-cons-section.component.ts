import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ProsCon {
  text: string;
  highlight?: boolean;
}

export interface ProsConsData {
  pros: ProsCon[];
  cons: ProsCon[];
  title?: string;
}

@Component({
  selector: 'app-pros-cons-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pros-cons-section.component.html',
  styleUrls: ['./pros-cons-section.component.css']
})
export class ProsConsSectionComponent {
  @Input() data: ProsConsData = { pros: [], cons: [] };
}
