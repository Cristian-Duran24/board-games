import { Routes } from '@angular/router';

export const routes: Routes = [
  // Landing page (sin sidebar)
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home-page.component').then(m => m.HomePageComponent),
    title: '10Minds BoardGames - Inicio',
  },

  // Páginas internas (con sidebar + layout shell)
  {
    path: '',
    loadComponent: () =>
      import('./layout/layout-shell.component').then(m => m.LayoutShellComponent),
    children: [
      {
        path: 'juegos',
        loadComponent: () =>
          import('./features/games/games-page.component').then(m => m.GamesPageComponent),
        title: '10Minds BoardGames - Juegos',
      },
      {
        path: 'prestamos',
        loadComponent: () =>
          import('./features/loans/loans-page.component').then(m => m.LoansPageComponent),
        title: '10Minds BoardGames - Préstamos',
      },
      {
        path: 'clientes',
        loadComponent: () =>
          import('./features/clients/clients-page.component').then(m => m.ClientsPageComponent),
        title: '10Minds BoardGames - Clientes',
      },
      {
        path: 'categorias',
        loadComponent: () =>
          import('./features/categories/categories-page.component').then(m => m.CategoriesPageComponent),
        title: '10Minds BoardGames - Categorías',
      },
    ],
  },

  // Wildcard
  {
    path: '**',
    redirectTo: '',
  },
];
