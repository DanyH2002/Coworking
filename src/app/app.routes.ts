import { Routes } from '@angular/router';
import { DashbordComponent } from './dashbord/dashbord/dashbord.component';
import { LoginComponent } from './users/login/login.component';
import { RegistroComponent } from './users/registro/registro.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashbord', component: DashbordComponent },
  { path: 'registro', component: RegistroComponent },
  { path: '**', redirectTo: '/login' },
];
