import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-stock-badge',
  standalone: true,
  imports: [],
  templateUrl: './stock-badge.component.html'
})
export class StockBadgeComponent {
  // --- Input requerido: recibe el stock actual del juego ---
  readonly stock = input.required<number>();

  // --- Computed: determina si hay stock disponible ---
  protected readonly isAvailable = computed(() => this.stock() > 0);

  // Muestra el número exacto si hay stock: "3 disponibles"
  protected readonly label = computed(() =>
    this.isAvailable()
      ? `● ${this.stock()} disponible${this.stock() > 1 ? 's' : ''}`
      : '● Agotado'
  );

  protected readonly computedClasses = computed(() => {
    const base = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border';
    return this.isAvailable()
      ? `${base} bg-chip-green-bg text-chip-green border-chip-green-border`
      : `${base} bg-chip-red-bg   text-chip-red   border-chip-red-border`;
  });
}
