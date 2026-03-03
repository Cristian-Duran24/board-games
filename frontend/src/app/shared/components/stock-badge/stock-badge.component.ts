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

  // Reutiliza los mismos tokens de chip del Design System (mismo lenguaje visual)
  // bg-chip-green-bg  ← --color-chip-green-bg:  rgba(34, 197, 94, 0.1)
  // text-chip-green   ← --color-chip-green:      #22C55E
  // bg-chip-red-bg    ← --color-chip-red-bg:    rgba(214, 69, 69, 0.1)
  // text-chip-red     ← --color-chip-red:        #D64545
  protected readonly computedClasses = computed(() => {
    const base = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border';
    return this.isAvailable()
      ? `${base} bg-chip-green-bg text-chip-green border-chip-green-border`
      : `${base} bg-chip-red-bg   text-chip-red   border-chip-red-border`;
  });
}
