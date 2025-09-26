import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouterStateService {
  private stateSubject = new BehaviorSubject<any>(null);
  public state$ = this.stateSubject.asObservable();

  setRouterState(state: any) {
    console.log('RouterStateService: Setting state', state);
    this.stateSubject.next(state);
    
    // Auto-clear after a short delay to ensure destination component has time to receive it
    setTimeout(() => {
      console.log('RouterStateService: Auto-clearing state after delay');
      this.stateSubject.next(null);
    }, 1000);
  }

  getRouterState() {
    const currentState = this.stateSubject.value;
    console.log('RouterStateService: Getting state', currentState);
    return currentState;
  }

  clearState() {
    console.log('RouterStateService: Clearing state');
    this.stateSubject.next(null);
  }
}