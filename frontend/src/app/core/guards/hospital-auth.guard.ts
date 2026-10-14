import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { HospitalAuthService } from '../services/hospital-auth.service';

export const hospitalAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(HospitalAuthService);
  const router = inject(Router);

  const token = authService.getToken();
  const isAuth = authService.isAuthenticated();
  const isHosp = authService.isHospital();

  if (!token || !isAuth || !isHosp) {
    authService.logout(false);
    return router.createUrlTree(['/hospital/login'], {
      queryParams: { returnUrl: state.url }
    });
  }

  return true;
};
