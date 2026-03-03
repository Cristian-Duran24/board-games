import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../layout/sidebar/sidebar.component';

/**
 * Shell de layout para las páginas internas de la aplicación.
 * Incluye el sidebar izquierdo fijo + el área de contenido con scroll propio.
 * La ruta raíz (home/landing) no usa este layout.
 */
@Component({
  selector: 'app-layout-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="flex h-screen overflow-hidden bg-canvas">
      <!-- Sidebar fija a la izquierda -->
      <app-sidebar />

      <!-- Área principal: header externo + router-outlet -->
      <div class="flex flex-col flex-1 min-w-0 overflow-hidden">

        <!-- Top bar global -->
        <header class="flex items-center justify-between px-8 py-4 border-b border-border-default bg-canvas shrink-0">
          <!-- Espacio izquierdo: puede usarse para botón hamburguesa o breadcrumb futuro -->
          <div></div>

          <!-- Usuario administrador (lado derecho) -->
          <div class="flex items-center gap-3">
            <div class="text-right">
              <p class="text-sm font-semibold text-text-primary leading-tight">Jhon Doe</p>
              <p class="text-xs text-text-muted">Super Admin</p>
            </div>
            <div class="w-9 h-9 rounded-full bg-success/20 text-success flex items-center justify-center text-sm font-bold shrink-0">
              JD
            </div>
          </div>
        </header>

        <!-- Contenido de la ruta activa -->
        <main class="flex-1 overflow-y-auto px-8 py-6" aria-label="Contenido principal">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class LayoutShellComponent { }
