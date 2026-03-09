import { gql } from 'apollo-angular';

export const GET_CLIENTS = gql`
  query GetClients($offset: Int = 0, $limit: Int = 100) {
    clients(offset: $offset, limit: $limit) {
      id
      name
      phone
      email
      loans {
        id
        status
      }
    }
  }
`;

export const CREATE_CLIENT = gql`
  mutation CreateClient($input: CreateClientInput!) {
    createClient(createClientInput: $input) {
      id
      name
      phone
      email
    }
  }
`;

export const UPDATE_CLIENT = gql`
  mutation UpdateClient($input: UpdateClientInput!) {
    updateClient(updateClientInput: $input) {
      id
      name
      phone
      email
    }
  }
`;

export const REMOVE_CLIENT = gql`
  mutation RemoveClient($id: Int!) {
    removeClient(id: $id) {
      id
      name
    }
  }
`;
