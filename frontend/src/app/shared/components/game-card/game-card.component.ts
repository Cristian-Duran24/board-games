import { Component, computed, input, output, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { LucideAngularModule, Users, Clock, MoreVertical, Pencil, Trash2 } from 'lucide-angular';
import { ChipComponent, type ChipColor } from '../chip/chip.component';
import { StockBadgeComponent } from '../stock-badge/stock-badge.component';

@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [DecimalPipe, LucideAngularModule, ChipComponent, StockBadgeComponent],
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

  protected readonly iconUsers = Users;
  protected readonly iconClock = Clock;
  protected readonly iconMoreVertical = MoreVertical;

  // Outputs para que la página padre maneje la acción
  readonly editClicked = output<void>();
  readonly deleteClicked = output<void>();

  // Estado local del menú desplegable
  protected readonly menuOpen = signal(false);

  protected readonly iconPencil = Pencil;
  protected readonly iconTrash = Trash2;

  toggleMenu(event: MouseEvent): void {
    event.stopPropagation();   // evita que el click cierre el menú inmediatamente
    this.menuOpen.update(v => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  onEdit(event: MouseEvent): void {
    event.stopPropagation();
    this.menuOpen.set(false);
    this.editClicked.emit();
  }

  onDelete(event: MouseEvent): void {
    event.stopPropagation();
    this.menuOpen.set(false);
    this.deleteClicked.emit();
  }
}
