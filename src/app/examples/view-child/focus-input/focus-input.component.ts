import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-focus-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './focus-input.component.html',
  styleUrls: ['./focus-input.component.css']
})
export class FocusInputComponent {
  @ViewChild('input', { static: false }) inputElement!: ElementRef<HTMLInputElement>;
  
  value = '';
  isFocused = false;
  private interactionCount = 0;
  
  focusInput() {
    if (this.inputElement) {
      this.inputElement.nativeElement.focus();
    }
  }
  
  clearInput() {
    this.value = '';
    this.focusInput();
  }
  
  setValue(newValue: string) {
    this.value = newValue;
    this.interactionCount++;
  }
  
  getValue(): string {
    return this.value;
  }
  
  getInteractionCount(): number {
    return this.interactionCount;
  }
  
  onFocus() {
    this.isFocused = true;
    this.interactionCount++;
  }
  
  onBlur() {
    this.isFocused = false;
  }
}