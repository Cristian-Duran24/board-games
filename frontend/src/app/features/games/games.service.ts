import { Injectable, signal, computed } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, take } from 'rxjs';
import type { ChipColor } from '../../shared/components/chip/chip.component';
import { GET_GAMES, CREATE_GAME, UPDATE_GAME, REMOVE_GAME } from '../../graphql/games.graphql';
import { GET_CATEGORIES } from '../../graphql/categories.graphql';
import type { Category, CreateGamePayload, UpdateGamePayload, Game } from './interfaces/game.interface';

interface GetGamesResponse { games: Game[] }
interface GetCategoriesResponse { categories: Category[] }

const CATEGORY_COLORS: ChipColor[] = ['blue', 'green', 'yellow', 'indigo', 'red', 'disabled'];

@Injectable({ providedIn: 'root' })
export class GamesService {

  constructor(private readonly apollo: Apollo) {}

  // Estado reactivo privado
  private readonly _games = signal<Game[]>([]);
  private readonly _categories = signal<Category[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  // API pública (readonly)
  readonly games = this._games.asReadonly();
  readonly categories = this._categories.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  /** Mapa categoryId → ChipColor determinista por posición */
  readonly categoryColorMap = computed<Record<number, ChipColor>>(() => {
    return this._categories().reduce((acc, cat, i) => {
      acc[cat.id] = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
      return acc;
    }, {} as Record<number, ChipColor>);
  });

  /** Carga todos los juegos (network-only para datos frescos) */
  loadGames(): void {
    this._loading.set(true);
    this._error.set(null);

    this.apollo
      .query<GetGamesResponse>({
        query: GET_GAMES,
        variables: { offset: 0, limit: 100 },
        fetchPolicy: 'network-only',
      })
      .pipe(take(1))
      .subscribe({
        next: ({ data }) => {
          this._games.set((data?.games ?? []) as Game[]);
          this._loading.set(false);
        },
        error: (err: Error) => {
          this._error.set(err.message ?? 'Error al cargar los juegos');
          this._loading.set(false);
        },
      });
  }

  /** Carga todas las categorías */
  loadCategories(): void {
    this.apollo
      .query<GetCategoriesResponse>({
        query: GET_CATEGORIES,
        fetchPolicy: 'network-only',
      })
      .pipe(take(1))
      .subscribe({
        next: ({ data }) => this._categories.set((data?.categories ?? []) as Category[]),
        error: (err: Error) =>
          console.error('[GamesService] loadCategories error:', err.message),
      });
  }

  /** Crea un juego. La recarga de lista se gestiona desde el componente padre. */
  createGame(payload: CreateGamePayload): Observable<unknown> {
    return this.apollo.mutate({
      mutation: CREATE_GAME,
      variables: { input: payload },
    });
  }

  /** Actualiza un juego existente */
  updateGame(payload: UpdateGamePayload): Observable<unknown> {
    return this.apollo.mutate({
      mutation: UPDATE_GAME,
      variables: { input: payload },
    });
  }

  /** Elimina (soft-remove) un juego por id */
  deleteGame(id: number): Observable<unknown> {
    return this.apollo.mutate({
      mutation: REMOVE_GAME,
      variables: { id },
    });
  }

  /** Color de chip para una categoría (default: 'blue') */
  getCategoryColor(categoryId: number): ChipColor {
    return this.categoryColorMap()[categoryId] ?? 'blue';
  }
}
