import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LucideAngularModule, Menu, ChevronDown } from 'lucide-angular';
import { SidebarComponent } from '../layout/sidebar/sidebar.component';

@Component({
  selector: 'app-layout-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, LucideAngularModule],
  templateUrl: './layout-shell.component.html',
})
export class LayoutShellComponent {
  protected readonly iconMenu = Menu;
  protected readonly iconChevronDown = ChevronDown;

  protected readonly sidebarOpen = signal(true);

  protected toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }
}
