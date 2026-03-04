import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LucideAngularModule, Menu, ChevronDown } from 'lucide-angular';
import { SidebarComponent } from '../layout/sidebar/sidebar.component';

/**
 * Shell de layout para las páginas internas de la aplicación.
 * Incluye el sidebar izquierdo fijo + el área de contenido con scroll propio.
 * La ruta raíz (home/landing) no usa este layout.
 */
@Component({
  selector: 'app-layout-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, LucideAngularModule],
  template: `
    <div class="flex h-screen overflow-hidden bg-canvas">
      <!-- Sidebar fija a la izquierda -->
      <app-sidebar />

      <!-- Área principal -->
      <div class="flex flex-col flex-1 min-w-0 overflow-hidden">

        <!-- Top bar global -->
        <header class="flex items-center justify-between px-8 py-3 border-b border-border-default bg-canvas shrink-0">
          <!-- Botón hamburguesa -->
          <button type="button" class="p-1.5 rounded-lg hover:bg-subtle/30 text-text-secondary transition-colors">
            <lucide-icon [img]="iconMenu" class="w-6 h-6" />
          </button>

          <!-- Usuario administrador (lado derecho) -->
          <!-- TODO: reemplazar con datos reales del AuthService cuando se implemente auth -->
          <button type="button" class="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div class="text-right">
              <p class="text-sm font-semibold text-text-primary leading-tight">Jhon Doe</p>
              <p class="text-xs text-text-muted">Super Admin</p>
            </div>
            <div class="w-9 h-9 rounded-full bg-amber-700 flex items-center justify-center overflow-hidden shrink-0">
              <img src="https://api.dicebear.com/9.x/initials/svg?seed=JD&backgroundColor=e8a72a" alt="Avatar" class="w-full h-full" />
            </div>
            <lucide-icon [img]="iconChevronDown" class="w-4 h-4 text-text-muted" />
          </button>
        </header>

        <!-- Contenido de la ruta activa -->
        <main class="flex-1 overflow-y-auto px-8 py-6" aria-label="Contenido principal">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class LayoutShellComponent {
  protected readonly iconMenu = Menu;
  protected readonly iconChevronDown = ChevronDown;
}
