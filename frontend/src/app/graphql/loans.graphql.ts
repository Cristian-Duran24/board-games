import { gql } from 'apollo-angular';

export const GET_LOANS = gql`
  query GetLoans($offset: Int = 0, $limit: Int = 100) {
    loans(offset: $offset, limit: $limit) {
      id
      startDate
      endDate
      actualReturnDate
      status
      totalPrice
      penalty
      game {
        id
        title
        price
        image
        category {
          id
          name
        }
      }
      client {
        id
        name
        phone
      }
    }
  }
`;

export const CREATE_LOAN = gql`
  mutation CreateLoan($input: CreateLoanInput!) {
    createLoan(createLoanInput: $input) {
      id
      startDate
      endDate
      status
      totalPrice
      game {
        id
        title
      }
      client {
        id
        name
      }
    }
  }
`;

export const UPDATE_LOAN = gql`
  mutation UpdateLoan($input: UpdateLoanInput!) {
    updateLoan(updateLoanInput: $input) {
      id
      startDate
      endDate
      status
      totalPrice
      penalty
    }
  }
`;

export const RETURN_LOAN = gql`
  mutation ReturnLoan($id: Int!) {
    returnGame(id: $id) {
      id
      status
      actualReturnDate
      penalty
    }
  }
`;

export const REMOVE_LOAN = gql`
  mutation RemoveLoan($id: Int!) {
    removeLoan(id: $id) {
      id
    }
  }
`;
