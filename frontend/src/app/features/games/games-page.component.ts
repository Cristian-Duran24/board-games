import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LucideAngularModule, Search, Plus } from 'lucide-angular';

import { GamesService } from './games.service';
import { GameCardComponent } from '../../shared/components/game-card/game-card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import {
  CreateGameDialogComponent,
  type CreateGameDialogData,
} from './create-game-dialog/create-game-dialog.component';
import type { Game } from './interfaces/game.interface';

@Component({
  selector: 'app-games-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogModule,
    MatProgressSpinnerModule,
    LucideAngularModule,
    GameCardComponent,
    ButtonComponent,
  ],
  templateUrl: './games-page.component.html',
})
export class GamesPageComponent implements OnInit {

  // ── Inyecciones ───────────────────────────────────────────────────────
  protected readonly gamesService = inject(GamesService);
  private readonly dialog = inject(MatDialog);

  // ── Iconos Lucide ─────────────────────────────────────────────────────
  protected readonly iconSearch = Search;
  protected readonly iconPlus = Plus;

  // ── Filtros (signals locales) ─────────────────────────────────────────

  /** null = "Todos" los juegos; number = id de la categoría seleccionada */
  protected readonly selectedCategoryId = signal<number | null>(null);

  /** Texto ingresado en el buscador */
  protected readonly searchQuery = signal<string>('');

  // ── Lista filtrada (computed) ─────────────────────────────────────────

  /**
   * Aplica filtros de categoría y búsqueda por nombre.
   * La búsqueda es case-insensitive y usa includes.
   */
  protected readonly filteredGames = computed<Game[]>(() => {
    const games = this.gamesService.games();
    const categoryId = this.selectedCategoryId();
    const query = this.searchQuery().trim().toLowerCase();

    return games.filter(game => {
      const matchesCategory = categoryId === null || game.category.id === categoryId;
      const matchesSearch = !query || game.title.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  });

  // ── Ciclo de vida ─────────────────────────────────────────────────────

  ngOnInit(): void {
    this.gamesService.loadGames();
    this.gamesService.loadCategories();
  }

  // ── Handlers de UI ───────────────────────────────────────────────────

  selectCategory(categoryId: number | null): void {
    this.selectedCategoryId.set(categoryId);
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  /**
   * Abre el dialog de creación de juego.
   * Pasa las categorías ya cargadas para no hacer una petición extra.
   * Al cerrar con confirmación (result === true), recarga la lista.
   */
  openCreateDialog(): void {
    const data: CreateGameDialogData = {
      categories: this.gamesService.categories(),
    };

    const dialogRef = this.dialog.open(CreateGameDialogComponent, {
      data,
      width: '640px',
      maxWidth: '95vw',
      panelClass: ['game-dialog'],
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.gamesService.loadGames();
      }
    });
  }
}
