import { Routes, CanActivateFn } from '@angular/router';
import { DashbordComponent } from './dashbord/dashbord/dashbord.component';
import { LoginComponent } from './auth/login/login.component';
import { NavbarComponent } from './dashbord/navbar/navbar.component';
import { ListaComponent } from './espacios/lista/lista.component'
import { ListComponent } from './reservaciones/list/list.component';
import { guardGuard } from './shared/Guards/guard.guard';
import { adminguardGuard } from './shared/Guards/adminguard.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'inicio',
    component: NavbarComponent,canActivate: [guardGuard],
    children: [
      { path: '', component: DashbordComponent, canActivate: [adminguardGuard] },
      { path: 'nuevo_espacio', loadComponent: () => import('./espacios/agregar/agregar.component').then(c => c.AgregarComponent), canActivate: [adminguardGuard] },
      { path: 'espacio/:id', loadComponent: () => import('./espacios/agregar/agregar.component').then(c => c.AgregarComponent), canActivate: [adminguardGuard] },
      { path: 'espacio_detalle/:id', loadComponent: () => import('./espacios/detalles/detalles.component').then(c => c.DetallesComponent), canActivate: [guardGuard] },
      { path: 'espacios', component: ListaComponent, canActivate: [guardGuard] },
      { path: 'nueva_reservacion', loadComponent: () => import('./reservaciones/agregar/agregar.component').then(c => c.AgregarComponent), canActivate: [guardGuard] },
      { path: 'reservacion_detalle/:id', loadComponent: () => import('./reservaciones/detalles/detalles.component').then(c => c.DetallesComponent), canActivate: [guardGuard] },
      { path: 'reservaciones', component: ListComponent, canActivate: [guardGuard] },
    ]
  },
  { path: 'registro', loadComponent: () => import('./auth/registro/registro.component').then(c => c.RegistroComponent) },
  { path: 'usuarios', loadComponent: () => import('./usuario/lista/lista.component').then(c => c.ListaComponent), canActivate: [adminguardGuard] },
  { path: 'usuario/:id', loadComponent: () => import('./usuario/agregar/agregar.component').then(c => c.AgregarComponent), canActivate: [adminguardGuard] },
  { path: 'nuevo_usuario', loadComponent: () => import('./usuario/agregar/agregar.component').then(c => c.AgregarComponent), canActivate: [adminguardGuard] },
  { path: '**', redirectTo: '/login' },
];
