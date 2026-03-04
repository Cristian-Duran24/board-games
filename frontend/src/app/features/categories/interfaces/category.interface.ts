/**
 * Interfaces TypeScript que replican exactamente los tipos del esquema GraphQL del backend
 * para la entidad Category.
 */

export interface Category {
  id: number;
  name: string;
}

/** Payload para la mutación createCategory */
export interface CreateCategoryPayload {
  name: string;
}

/** Payload para la mutación updateCategory */
export interface UpdateCategoryPayload {
  id: number;
  name?: string;
}
