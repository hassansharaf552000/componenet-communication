import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CodeExample {
  title: string;
  language: string;
  code: string;
  explanation?: string;
}

@Component({
  selector: 'app-code-examples',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './code-examples.component.html',
  styleUrls: ['./code-examples.component.css']
})
export class CodeExamplesComponent {
  @Input() examples: CodeExample[] = [];
}
