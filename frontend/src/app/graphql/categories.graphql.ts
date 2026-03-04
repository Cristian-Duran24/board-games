import { gql } from 'apollo-angular';

/**
 * Obtiene todas las categorías.
 * Compartido entre GamesService (filtros) y CategoriesService (CRUD).
 */
export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`;

/**
 * Crea una nueva categoría.
 */
export const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(createCategoryInput: $input) {
      id
      name
    }
  }
`;

/**
 * Actualiza el nombre de una categoría existente.
 */
export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($input: UpdateCategoryInput!) {
    updateCategory(updateCategoryInput: $input) {
      id
      name
    }
  }
`;

/**
 * Elimina (softRemove) una categoría por id.
 * Devuelve el objeto borrado para confirmar la operación.
 */
export const REMOVE_CATEGORY = gql`
  mutation RemoveCategory($id: Int!) {
    removeCategory(id: $id) {
      id
      name
    }
  }
`;
