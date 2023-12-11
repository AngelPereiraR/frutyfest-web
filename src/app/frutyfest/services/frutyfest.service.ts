import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, signal, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environments } from 'src/environments/environments';
import { Team } from '../interfaces/team.interface';
import { User } from 'src/app/auth/interfaces';

@Injectable({
  providedIn: 'root'
})
export class FrutyfestService {
  private readonly baseUrl: string = environments.baseUrl;
  private http = inject(HttpClient);
  private router = inject(Router);

  private _currentPage = signal<string | null>(null);
  public currentPage = computed(() => this._currentPage());

  setPage(page: string) {
    this._currentPage.set(page);
  }

  getTeams(): Observable<Team[]> {
    const url = `${this.baseUrl}/team`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.http.get<Team[]>(url, { headers })
      .pipe(
        map((teams) => {
          return teams;
        }),
        catchError(err => throwError(() => err.error.message))
      );
  }

  getTeam(id: string): Observable<Team> {
    const url = `${this.baseUrl}/team/${id}`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.http.get<Team>(url, { headers })
      .pipe(
        map((team) => {
          return team;
        }),
        catchError(err => throwError(() => err.error.message))
      );
  }

  addTeam(color: string, users: User[], totalPoints: number) {
    const url = `${this.baseUrl}/team`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    const body = { color, users, totalPoints };

    return this.http.post<Team>(url, body, { headers })
      .pipe(
        map((team) => {
          return team;
        }),
        catchError(err => throwError(() => err.error.message))
      );
  }

  removeTeam(id: string) {
    const url = `${this.baseUrl}/team/${id}`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.http.delete<Team>(url, { headers })
      .pipe(
        catchError(err => throwError(() => err.error.message))
      );
  }
}
