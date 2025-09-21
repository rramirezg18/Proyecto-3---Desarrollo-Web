import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthenticationService);
  const router = inject(Router);

  if (auth.isAdmin()) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};
