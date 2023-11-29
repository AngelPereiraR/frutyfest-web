import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

export const isNotAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.currentUser()?.roles.includes('admin')) {
    return true;
  }

  // const url = state.url;
  // localStorage.setItem('url', url);

  router.navigateByUrl('/index')

  return false;
};
