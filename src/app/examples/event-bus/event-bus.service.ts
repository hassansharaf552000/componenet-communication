import { Injectable } from '@angular/core';
import { Subject, filter, map, Observable } from 'rxjs';

export type EventPayload = { type: string; payload?: unknown };

@Injectable({ providedIn: 'root' })
export class EventBusService {
  private readonly bus$ = new Subject<EventPayload>();
  emit(event: EventPayload){ this.bus$.next(event); }
  on<T>(type: string): Observable<T> {
    return this.bus$.pipe(filter(e => e.type === type), map(e => e.payload as T));
  }
}
