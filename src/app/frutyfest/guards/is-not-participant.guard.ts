import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { AuthStatus } from 'src/app/auth/interfaces';

export const isNotParticipantGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.currentUser?.roles.includes('participant')) {
    return true;
  }

  if(authService.authStatus() === AuthStatus.notAuthenticated) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    authService.currentUser = null;
  }

  // const url = state.url;
  // localStorage.setItem('url', url);

  router.navigateByUrl('/')

  return false;
};
