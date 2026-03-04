import { Injectable, signal } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, take } from 'rxjs';
import {
  GET_CATEGORIES,
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  REMOVE_CATEGORY,
} from '../../graphql/categories.graphql';
import type {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from './interfaces/category.interface';

interface GetCategoriesResponse { categories: Category[] }

@Injectable({ providedIn: 'root' })
export class CategoriesService {

  constructor(private readonly apollo: Apollo) {}

  // Estado reactivo privado
  private readonly _categories = signal<Category[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  // API pública (readonly)
  readonly categories = this._categories.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  /** Carga todas las categorías (network-only para datos frescos) */
  loadCategories(): void {
    this._loading.set(true);
    this._error.set(null);

    this.apollo
      .query<GetCategoriesResponse>({
        query: GET_CATEGORIES,
        fetchPolicy: 'network-only',
      })
      .pipe(take(1))
      .subscribe({
        next: ({ data }) => {
          this._categories.set((data?.categories ?? []) as Category[]);
          this._loading.set(false);
        },
        error: (err: Error) => {
          this._error.set(err.message ?? 'Error al cargar las categorías');
          this._loading.set(false);
        },
      });
  }

  /** Crea una nueva categoría */
  createCategory(payload: CreateCategoryPayload): Observable<unknown> {
    return this.apollo.mutate({
      mutation: CREATE_CATEGORY,
      variables: { input: payload },
    });
  }

  /** Actualiza una categoría existente */
  updateCategory(payload: UpdateCategoryPayload): Observable<unknown> {
    return this.apollo.mutate({
      mutation: UPDATE_CATEGORY,
      variables: { input: payload },
    });
  }

  /** Elimina (soft-remove) una categoría por id */
  removeCategory(id: number): Observable<unknown> {
    return this.apollo.mutate({
      mutation: REMOVE_CATEGORY,
      variables: { id },
    });
  }
}
