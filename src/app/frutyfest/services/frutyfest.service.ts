import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, signal, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, catchError, throwError, forkJoin, mergeMap } from 'rxjs';
import { environments } from 'src/environments/environments.prod';
import { Team } from '../interfaces/team.interface';
import { User } from 'src/app/auth/interfaces';
import { Temporal, TemporalTeam } from '../interfaces/temporal.interface';

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

  setSelectedOnTemporal(id: string) {
    const url = `${this.baseUrl}/team/setSelectedOnTemporal/${id}`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.http.patch<Team>(url, {}, { headers })
      .pipe(
        catchError(err => throwError(() => err.error.message))
      );
  }

  removeSelectedOnTemporal(id: string) {
    const url = `${this.baseUrl}/team/removeSelectedOnTemporal/${id}`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.http.patch<Team>(url, {}, { headers })
      .pipe(
        catchError(err => throwError(() => err.error.message))
      );
  }

  getTemporals(): Observable<TemporalTeam[]> {
    const url = `${this.baseUrl}/temporalteam`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.http.get<Temporal[]>(url, { headers })
      .pipe(
        map((temporals) => {
          const temporalTeams: TemporalTeam[] = [];
          for (let i = 0; i < temporals.length; i++) {
            const { _id, color } = temporals[i];
            const teams: Team[] = [];
            let newTemporal: TemporalTeam = { _id, color, teams };
            newTemporal.teams = [];
            for (let j = 0; j < temporals[i].teams.length; j++) {
              this.getTeam(temporals[i].teams[j]).subscribe({ next: (team) => { return newTemporal.teams.push(team) } });
            }
            temporalTeams.push(newTemporal);
          }
          return temporalTeams;
        }),
        catchError(err => throwError(() => err.error.message))
      );
  }

  getTemporal(id: string): Observable<TemporalTeam> {
    const url = `${this.baseUrl}/temporalteam/${id}`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.http.get<Temporal>(url, { headers })
      .pipe(
        mergeMap((temporal) => {
          const { _id, color } = temporal;
          let newTemporal: TemporalTeam = { _id, color, teams: [] };

          const teamObservables = temporal.teams.map((teamId) => this.getTeam(teamId));

          return forkJoin(teamObservables).pipe(
            map((teams) => {
              newTemporal.teams = teams;
              return newTemporal;
            }),
            catchError((err) => throwError(() => err.error.message))
          );
        })
      );
  }

  addTemporal(color: string, teams: Team[]) {
    const url = `${this.baseUrl}/temporalteam`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    const body = { color, teams };

    return this.http.post<Temporal>(url, body, { headers })
      .pipe(
        map((temporal) => {
          return temporal;
        }),
        catchError(err => throwError(() => err.error.message))
      );
  }

  removeTemporal(id: string) {
    const url = `${this.baseUrl}/temporalteam/${id}`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.http.delete<Temporal>(url, { headers })
      .pipe(
        catchError(err => throwError(() => err.error.message))
      );
  }
}
