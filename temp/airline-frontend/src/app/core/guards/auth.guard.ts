import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStorageService } from '../services/auth-storage.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authStorage = inject(AuthStorageService);
  const router      = inject(Router);

  if (authStorage.isLoggedIn()) return true;

  router.navigate(['/auth/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};

export const guestGuard: CanActivateFn = () => {
  const authStorage = inject(AuthStorageService);
  const router      = inject(Router);

  if (!authStorage.isLoggedIn()) return true;

  router.navigate(['/']);
  return false;
};
