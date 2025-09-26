import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessageService {
  readonly message$ = new BehaviorSubject<string>('Hello');
  setMessage(v: string) { this.message$.next(v); }
}
