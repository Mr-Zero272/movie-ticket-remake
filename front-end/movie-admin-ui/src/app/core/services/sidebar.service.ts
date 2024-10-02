import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private _sidebarState: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor() {}

  showSidebar(): void {
    this._sidebarState.next(true);
  }

  hideSidebar(): void {
    this._sidebarState.next(false);
  }

  toggleSidebar(): void {
    this._sidebarState.next(!this._sidebarState.value);
  }

  get sidebarState() {
    return this._sidebarState.asObservable();
  }
}
