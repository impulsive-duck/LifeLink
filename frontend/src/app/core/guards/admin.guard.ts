import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { HospitalAuthService } from '../services/hospital-auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(HospitalAuthService);
  const router = inject(Router);

  const token = authService.getToken();
  const isAuth = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();

  if (!token || !isAuth || !isAdmin) {
    authService.logout(false);
    return router.createUrlTree(['/admin/login'], {
      queryParams: { returnUrl: state.url }
    });
  }

  return true;
};
