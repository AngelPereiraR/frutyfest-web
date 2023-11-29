import { Injectable, computed, signal, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FrutyfestService {

  private _currentPage = signal<string | null>(null);
  public currentPage = computed(() => this._currentPage());

  setPage(page: string) {
    this._currentPage.set(page);
  }
}
