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
            this.router.navigateByUrl('/index/admin');
          } else {
            this.router.navigateByUrl('/index');
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
}
