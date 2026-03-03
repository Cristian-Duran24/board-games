import { Component, input } from '@angular/core';
import { ChipComponent, type ChipColor } from '../chip/chip.component';
import { StockBadgeComponent } from '../stock-badge/stock-badge.component';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [ChipComponent, StockBadgeComponent, ButtonComponent],
  templateUrl: './game-card.component.html'
})
export class GameCardComponent {
  // --- Inputs requeridos (datos del juego desde la API GraphQL) ---
  readonly titulo          = input.required<string>();
  readonly image           = input.required<string>();
  readonly precio          = input.required<number>();
  readonly jugadoresMin    = input.required<number>();
  readonly jugadoresMax    = input.required<number>();
  readonly duracion        = input.required<number>();
  readonly stockDisponible = input.required<number>();
  readonly category        = input.required<string>();

  // --- Input opcional: color del chip de categoría ---
  readonly categoryColor = input<ChipColor>('blue');
}
