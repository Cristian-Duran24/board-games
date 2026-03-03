import { Injectable, signal, computed } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, tap } from 'rxjs';
import type { ChipColor } from '../../shared/components/chip/chip.component';
import { GET_GAMES, GET_CATEGORIES, CREATE_GAME } from '../../graphql/games.graphql';
import type {
  Category,
  CreateGamePayload,
  Game,
} from './interfaces/game.interface';

// ── Tipos de respuesta GraphQL ──────────────────────────────────────────────
interface GetGamesResponse { games: Game[] }
interface GetCategoriesResponse { categories: Category[] }

// ── Paleta de colores para chips de categoría ──────────────────────────────
const CATEGORY_COLORS: ChipColor[] = ['blue', 'green', 'yellow', 'indigo', 'red', 'disabled'];

@Injectable({ providedIn: 'root' })
export class GamesService {

  constructor(private readonly apollo: Apollo) { }

  // ── Estado reactivo (signals privados) ────────────────────────────────────
  private readonly _games = signal<Game[]>([]);
  private readonly _categories = signal<Category[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // ── API pública (readonly) ────────────────────────────────────────────────
  readonly games = this._games.asReadonly();
  readonly categories = this._categories.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // ── Computed públicos ─────────────────────────────────────────────────────

  /** Mapa categoryId → ChipColor asignado por posición (determinista) */
  readonly categoryColorMap = computed<Record<number, ChipColor>>(() => {
    return this._categories().reduce(
      (acc, cat, index) => {
        acc[cat.id] = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
        return acc;
      },
      {} as Record<number, ChipColor>
    );
  });

  // ── Métodos de carga ──────────────────────────────────────────────────────

  /**
   * Carga todos los juegos desde el backend.
   * Usa fetchPolicy 'network-only' para evitar datos cacheados desactualizados.
   */
  loadGames(): void {
    this._loading.set(true);
    this._error.set(null);

    this.apollo
      .watchQuery<GetGamesResponse>({
        query: GET_GAMES,
        variables: { offset: 0, limit: 100 },
        fetchPolicy: 'network-only',
      })
      .valueChanges
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

  /**
   * Carga todas las categorías.
   * Las categorías cambian con poca frecuencia; se usa cache-first.
   */
  loadCategories(): void {
    this.apollo
      .watchQuery<GetCategoriesResponse>({
        query: GET_CATEGORIES,
        fetchPolicy: 'cache-first',
      })
      .valueChanges
      .subscribe({
        next: ({ data }) => this._categories.set((data?.categories ?? []) as Category[]),
        error: (err: Error) =>
          console.error('[GamesService] loadCategories error:', err.message),
      });
  }

  /**
   * Crea un nuevo juego en el backend y recarga la lista si tiene éxito.
   * @param payload datos del formulario (imagen ya procesada como Base64 puro)
   * @returns Observable con el juego creado
   */
  createGame(payload: CreateGamePayload): Observable<unknown> {
    return this.apollo
      .mutate({
        mutation: CREATE_GAME,
        variables: { input: payload },
      })
      .pipe(
        tap(() => this.loadGames())
      );
  }

  // ── Helpers públicos ──────────────────────────────────────────────────────

  /**
   * Devuelve el ChipColor asignado a una categoría por su id.
   * Si no se encuentra, devuelve 'blue' como valor por defecto.
   */
  getCategoryColor(categoryId: number): ChipColor {
    return this.categoryColorMap()[categoryId] ?? 'blue';
  }

  /**
   * Construye el src completo para un <img> a partir de la cadena Base64 pura
   * almacenada en la BD (sin prefijo data:...).
   * Devuelve null si no hay imagen → el componente usará el fallback de iniciales.
   */
  getImageSrc(base64?: string): string | null {
    if (!base64) return null;
    return `data:image/png;base64,${base64}`;
  }
}
