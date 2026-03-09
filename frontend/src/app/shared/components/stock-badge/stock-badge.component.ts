import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-stock-badge',
  standalone: true,
  imports: [],
  templateUrl: './stock-badge.component.html'
})
export class StockBadgeComponent {
  readonly stock = input.required<number>();

  protected readonly isAvailable = computed(() => this.stock() > 0);

  protected readonly label = computed(() =>
    this.isAvailable()
      ? `● ${this.stock()} disponible${this.stock() > 1 ? 's' : ''}`
      : '● Agotado'
  );

  protected readonly computedClasses = computed(() => {
    const base = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border';
    return this.isAvailable()
      ? `${base} bg-chip-green/10 text-chip-green border-chip-green/25`
      : `${base} bg-chip-red/10   text-chip-red   border-chip-red/25`;
  });
}
