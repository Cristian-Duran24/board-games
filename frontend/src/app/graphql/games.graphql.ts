import { gql } from 'apollo-angular';

/**
 * Obtiene todos los juegos con paginación.
 * Incluye los nuevos campos playersMin, playersMax, duration.
 */
export const GET_GAMES = gql`
  query GetGames($offset: Int = 0, $limit: Int = 100) {
    games(offset: $offset, limit: $limit) {
      id
      title
      price
      inTotal
      inStock
      image
      playersMin
      playersMax
      duration
      category {
        id
        name
      }
    }
  }
`;

/**
 * Obtiene todas las categorías para poblar el filtro de tabs y el select del dialog.
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
 * Crea un nuevo juego con imagen Base64 pura (sin prefijo data:...).
 * Devuelve los campos necesarios para actualizar la lista local.
 */
export const CREATE_GAME = gql`
  mutation CreateGame($input: CreateGameInput!) {
    createGame(createGameInput: $input) {
      id
      title
      price
      inTotal
      inStock
      image
      playersMin
      playersMax
      duration
      category {
        id
        name
      }
    }
  }
`;
