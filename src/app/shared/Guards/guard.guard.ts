import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guardGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  let token: string | null = null;
  let id: string | null = null;
  let name: string | null = null;
  let email: string | null = null;
  if (isPlatformBrowser(platformId)) {
    console.log("Guard - Ejecutando en el navegador");
    token = localStorage.getItem('token');
    id = localStorage.getItem('id');
    name = localStorage.getItem('nombre');
    email = localStorage.getItem('email');
  } else {
    console.log("Guard - Ejecutando en el servidor. No se puede acceder a localStorage");
  }
  if (!token) {
    const router = inject(Router);
    router.navigateByUrl('/login');
  }
  return token? true : false;
};
