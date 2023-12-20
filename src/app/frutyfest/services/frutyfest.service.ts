import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, signal, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, catchError, throwError, forkJoin, mergeMap } from 'rxjs';
import { environments } from 'src/environments/environments.prod';
import { Event, Team } from '../interfaces/team.interface';
import { User } from 'src/app/auth/interfaces';
import { Trial } from '../interfaces/trial.interface';

@Injectable({
  providedIn: 'root'
})
export class FrutyfestService {
  private readonly baseUrl: string = environments.baseUrl;
  private http = inject(HttpClient);

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

  addTeam(color: string, users: User[], event: Event, totalPoints: number, name: string) {
    const url = `${this.baseUrl}/team`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    const body = { color, users, event, totalPoints, name };

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

  getTrials(): Observable<Trial[]> {
    const url = `${this.baseUrl}/trial`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.http.get<Trial[]>(url, { headers })
      .pipe(
        map((trials) => {
          return trials;
        }),
        catchError(err => throwError(() => err.error.message))
      );
  }

  getTrial(id: string): Observable<Trial> {
    const url = `${this.baseUrl}/trial/${id}`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.http.get<Trial>(url, { headers })
      .pipe(
        map((trial) => {
          return trial;
        }),
        catchError(err => throwError(() => err.error.message))
      );
  }

  addTrial(name: string, maxPoints: number, pointsDecrease: number, maxTeams: number) {
    const url = `${this.baseUrl}/trial`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    const body = { name, maxPoints, pointsDecrease, maxTeams };

    return this.http.post<Trial>(url, body, { headers })
      .pipe(
        map((trial) => {
          return trial;
        }),
        catchError(err => throwError(() => err.error.message))
      );
  }

  removeTrial(id: string) {
    const url = `${this.baseUrl}/trial/${id}`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.http.delete<Trial>(url, { headers })
      .pipe(
        catchError(err => throwError(() => err.error.message))
      );
  }
}
