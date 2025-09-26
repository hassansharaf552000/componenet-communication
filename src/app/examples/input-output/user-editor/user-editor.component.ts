import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface User { 
  id: number; 
  name: string; 
  email: string; 
  role?: string 
}

@Component({
  selector: 'app-user-editor',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.css']
})
export class UserEditorComponent {
  @Input() user: User = { id: 0, name: '', email: '', role: '' };
  @Output() userSaved = new EventEmitter<User>();
  @Output() userCanceled = new EventEmitter<void>();

  onSave() {
    if (this.isFormValid()) {
      // Assign a new ID if it's 0 (new user)
      if (this.user.id === 0) {
        this.user.id = Date.now(); // Simple ID generation
      }
      this.userSaved.emit({ ...this.user });
      this.resetForm();
    }
  }

  onCancel() {
    this.userCanceled.emit();
    this.resetForm();
  }

  isFormValid(): boolean {
    return this.user.name.trim().length > 0 && 
           this.user.email.trim().length > 0 && 
           this.user.email.includes('@');
  }

  private resetForm() {
    this.user = { id: 0, name: '', email: '', role: '' };
  }
}