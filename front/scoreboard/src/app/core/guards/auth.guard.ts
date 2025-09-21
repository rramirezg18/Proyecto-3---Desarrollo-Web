import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  if (authService.getToken()) {
    return true; // ✅ tiene token, lo dejamos pasar
  } else {
    router.navigate(['/login']); // ❌ no hay token, redirige al login
    return false;
  }
};
