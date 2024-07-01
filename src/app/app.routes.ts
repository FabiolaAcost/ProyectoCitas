import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'gestion-citas',
    loadComponent: () => import('./components/gestion-citas/gestion-citas.component').then((m) => m.GestionCitasComponent),
  },
  {
    path: 'configuraciones',
    loadComponent: () => import('./components/configuraciones/configuraciones.component').then((m) => m.ConfiguracionesComponent),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
