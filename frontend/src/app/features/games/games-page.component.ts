import {
  Component,
  OnInit,
  DestroyRef,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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

  protected readonly gamesService = inject(GamesService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  // Iconos Lucide
  protected readonly iconSearch = Search;
  protected readonly iconPlus = Plus;

  // Filtros locales
  protected readonly selectedCategoryId = signal<number | null>(null);
  protected readonly searchQuery = signal('');

  /** Lista filtrada por categoría y búsqueda (case-insensitive) */
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

  ngOnInit(): void {
    this.gamesService.loadGames();
    this.gamesService.loadCategories();
  }

  selectCategory(categoryId: number | null): void {
    this.selectedCategoryId.set(categoryId);
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  /** Abre el dialog de creación de juego */
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

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.gamesService.loadGames();
      }
    });
  }
}
