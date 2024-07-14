import { inject } from '@angular/core';
import { RedirectFunction } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const redirectGuard: RedirectFunction = () => {
  const authService = inject(AuthService);

  if (!authService.isLogin) {
    return '/login';
  }
  
  if (authService.isAdmin) {
    return '/dashboard';
  }
  return '/store';
};
