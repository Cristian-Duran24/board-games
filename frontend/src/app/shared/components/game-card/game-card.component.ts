import { Component, computed, input } from '@angular/core';
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
  // --- Inputs requeridos ---
  readonly title = input.required<string>();
  readonly price = input.required<number>();
  readonly stock = input.required<number>();
  readonly category = input.required<string>();

  // --- Inputs opcionales (nullable en el backend) ---
  readonly image = input<string | undefined>(undefined);
  readonly playersMin = input<number | undefined>(undefined);
  readonly playersMax = input<number | undefined>(undefined);
  readonly duration = input<number | undefined>(undefined);

  // --- Input opcional: color del chip de categoría ---
  readonly categoryColor = input<ChipColor>('blue');

  /** Fallback: iniciales del título cuando no hay imagen */
  protected readonly initials = computed(() => {
    const words = this.title().trim().split(/\s+/);
    return words.length >= 2
      ? `${words[0][0]}${words[1][0]}`.toUpperCase()
      : this.title().slice(0, 2).toUpperCase();
  });

  /**
   * Paleta de 6 colores de fondo para el fallback de imagen.
   * Se selecciona de forma determinista usando el índice del juego.
   */
  private static readonly FALLBACK_COLORS = [
    '#1D4ED8', '#065F46', '#7C3AED', '#B45309', '#9D174D', '#0F766E',
  ];

  /** Color de fondo del fallback: se pasa el id del juego desde el padre */
  readonly fallbackColorIndex = input<number>(0);

  protected readonly fallbackBg = computed(() =>
    GameCardComponent.FALLBACK_COLORS[
    this.fallbackColorIndex() % GameCardComponent.FALLBACK_COLORS.length
    ]
  );

  /** Construye el src completo a partir del Base64 puro almacenado en BD */
  protected readonly imageSrc = computed(() => {
    const img = this.image();
    return img ? `data:image/png;base64,${img}` : null;
  });
}
