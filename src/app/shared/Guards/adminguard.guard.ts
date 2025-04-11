import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminguardGuard: CanActivateFn = (route, state) => {
  const rol = localStorage.getItem('rol'); // Obtenemos el rol del usuario desde localStorage

  if (rol !== '1'){ // Verificamos si el rol no es '1', que indica que no es un administrador
    const router = inject(Router);
    router.navigateByUrl('/inicio/espacios'); // Redirige si el usuario no es administrador
    return false; // Bloquea el acceso
  }
  return true;
};
