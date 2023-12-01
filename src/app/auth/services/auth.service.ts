import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { environments } from 'src/environments/environments';

import { User, AuthStatus, LoginResponse, CheckTokenResponse } from '../interfaces';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl: string = environments.baseUrl;
  private http = inject(HttpClient);
  private router = inject(Router);

  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  //! Al mundo exterior
  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());

  constructor() {
    this.checkAuthStatus().subscribe();
  }

  private setAuthentication(user: User, token: string): boolean {
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);

    return true;
  }

  getUsers(): Observable<User[]> {
    const url = `${this.baseUrl}/auth`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.http.get<User[]>(url, { headers })
      .pipe(
        map((users) => {
          return users;
        }),
        catchError(err => throwError(() => err.error.message))
      );
  }

  getUser(id: string): Observable<User> {
    const url = `${this.baseUrl}/auth/${id}`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.http.get<User>(url, { headers })
      .pipe(
        map((user) => {
          return user;
        }),
        catchError(err => throwError(() => err.error.message))
      );
  }

  login(email: string, password: string): Observable<User> {

    const url = `${this.baseUrl}/auth/login`;
    const body = { email, password };

    return this.http.post<LoginResponse>(url, body)
      .pipe(
        map(({ user, token }) => {
          this.setAuthentication(user, token);
          return user;
        }),
        catchError(err => throwError(() => err.error.message))
      );
  }

  register(email: string, password: string, name: string, hasCompanion: boolean, presentation: string, companionName: string): Observable<boolean> {

    const url = `${this.baseUrl}/auth/register`;
    const body = { email, password, name, hasCompanion, companionName, presentation };

    return this.http.post<boolean>(url, body)
      .pipe(
        catchError(err => throwError(() => err.error.message))
      );
  }

  checkAuthStatus(): Observable<boolean | void> {

    const url = `${this.baseUrl}/auth/check-token`;
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.http.get<CheckTokenResponse>(url, { headers })
      .pipe(
        map(({ token, user }) => {
          this.setAuthentication(user, token);
          if (user.roles.includes('admin')) {
            this.router.navigateByUrl('/admin');
          } else {
            this.router.navigateByUrl('/');
          }
        }),
        catchError(() => {
          this._authStatus.set(AuthStatus.notAuthenticated);
          return of(false);
        })
      )

  }

  logout() {
    localStorage.removeItem('token');
    this._authStatus.set(AuthStatus.notAuthenticated);
    this._currentUser.set(null);
  }

  setParticipant(id: string): Observable<User> {
    return this.participant('setParticipant', id);
  }

  removeParticipant(id: string): Observable<User> {
    return this.participant('removeParticipant', id);
  }

  removeUser(id: string) {
    const url = `${this.baseUrl}/auth/${id}`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.http.delete<User>(url, { headers })
      .pipe(
        catchError(err => throwError(() => err.error.message))
      );
  }

  private participant(route: string, id: string) {
    const url = `${this.baseUrl}/auth/${route}/${id}`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.http.patch<User>(url, {}, { headers })
      .pipe(
        catchError(err => throwError(() => err.error.message))
      );
  }

}
