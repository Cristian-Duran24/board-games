import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, CreditCard, Package, Users, Tag } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  // 4 entidades del backend: loans, games, clients, categories
  readonly menuItems = signal([
    { path: '/prestamos', label: 'Préstamos',  icon: CreditCard },
    { path: '/juegos',    label: 'Juegos',     icon: Package    },
    { path: '/clientes',  label: 'Clientes',   icon: Users      },
    { path: '/categorias',label: 'Categorías', icon: Tag        },
  ]);
}
