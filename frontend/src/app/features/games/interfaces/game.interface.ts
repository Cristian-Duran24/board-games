/**
 * Interfaces TypeScript que replican exactamente los tipos del esquema GraphQL del backend.
 * Todos los campos opcionales están marcados con `?` para reflejar los campos nullable de la entidad.
 */

export interface Category {
  id: number;
  name: string;
}

export interface Game {
  id: number;
  title: string;
  price: number;
  inTotal: number;
  inStock: number;
  image?: string;
  playersMin?: number;
  playersMax?: number;
  duration?: number;
  category: Category;
}

/** Payload para la mutación CreateGame (espeja CreateGameInput del backend) */
export interface CreateGamePayload {
  title: string;
  categoryId: number;
  price: number;
  inTotal: number;
  image?: string;
  playersMin?: number;
  playersMax?: number;
  duration?: number;
}
