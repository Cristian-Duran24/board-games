import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home-page.component').then(m => m.HomePageComponent),
    title: '10Minds BoardGames - Inicio'
  },
  // Future Usage (Lazy Load) - Placeholders temporales para probar navegación
  {
    path: 'juegos',
    loadComponent: () => import('./features/home/home-page.component').then(m => m.HomePageComponent),
  },
  {
    path: 'prestamos',
    loadComponent: () => import('./features/home/home-page.component').then(m => m.HomePageComponent),
  },
  {
    path: 'clientes',
    loadComponent: () => import('./features/home/home-page.component').then(m => m.HomePageComponent),
  },
  {
    path: 'categorias',
    loadComponent: () => import('./features/home/home-page.component').then(m => m.HomePageComponent), // Placeholder temporal
  },
  {
    path: '**',
    redirectTo: ''
  }
];
