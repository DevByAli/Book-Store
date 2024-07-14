import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

export const loginAndRegisterGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): MaybeAsync<GuardResult> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLogin && authService.isAdmin) {
    return router.navigate(['/dashboard']);
  } else if (authService.isLogin) {
    return router.navigate(['/store']);
  }

  return true;
};
