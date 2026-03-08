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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LucideAngularModule, Search, Plus } from 'lucide-angular';

import { GamesService } from './games.service';
import { GameCardComponent } from '../../shared/components/game-card/game-card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import {
  CreateGameDialogComponent,
  type CreateGameDialogData,
} from './create-game-dialog/create-game-dialog.component';
import {
  EditGameDialogComponent,
  type EditGameDialogData,
} from './edit-game-dialog/edit-game-dialog.component';
import {
  ConfirmDialogComponent,
  type ConfirmDialogData,
} from '../../shared/components/confirm-dialog/confirm-dialog.component';
import type { Game } from './interfaces/game.interface';

@Component({
  selector: 'app-games-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    LucideAngularModule,
    GameCardComponent,
    ButtonComponent,
  ],
  templateUrl: './games-page.component.html',
})
export class GamesPageComponent implements OnInit {

  protected readonly gamesService = inject(GamesService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
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

  /** Abre el dialog de edición de juego */
  openEditDialog(game: Game): void {
    const data: EditGameDialogData = {
      game,
      categories: this.gamesService.categories(),
    };

    const dialogRef = this.dialog.open(EditGameDialogComponent, {
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

  /** Abre dialog de confirmación y elimina el juego si se confirma */
  openDeleteDialog(game: Game): void {
    const data: ConfirmDialogData = {
      title: 'Eliminar juego',
      message: `¿Estás seguro de que quieres eliminar "${game.title}"? Esta acción no se puede deshacer.`,
      confirmLabel: 'Eliminar',
      cancelLabel: 'Cancelar',
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data,
      width: '420px',
      maxWidth: '95vw',
      disableClose: false,
    });

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.gamesService.deleteGame(game.id).subscribe({
            next: () => {
              this.snackBar.open('Juego eliminado correctamente.', 'Cerrar', { duration: 3000 });
              this.gamesService.loadGames();
            },
            error: (err: Error) => {
              this.snackBar.open(err.message ?? 'Error al eliminar el juego.', 'Cerrar', { duration: 4000 });
            },
          });
        }
      });
  }
}
