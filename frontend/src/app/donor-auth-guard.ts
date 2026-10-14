import { CanActivateFn } from '@angular/router';

import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const donorAuthGuard: CanActivateFn = () => {

  const router = inject(Router);

  const token =
    localStorage.getItem('donorToken');

  if (token) {

    return true;
  }

  router.navigate(['/donor/login']);

  return false;
};