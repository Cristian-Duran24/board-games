import type { Category } from '../../categories/interfaces/category.interface';

export type { Category };

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
