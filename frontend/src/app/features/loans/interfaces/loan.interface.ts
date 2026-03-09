export interface LoanGame {
  id: number;
  title: string;
  price: number;
  image?: string;
  category?: { id: number; name: string };
}

export interface LoanClient {
  id: number;
  name: string;
  phone: string;
}

export interface Loan {
  id: number;
  game: LoanGame;
  client: LoanClient;
  startDate: string;
  endDate: string;
  actualReturnDate?: string;
  status: 'active' | 'returned' | 'overdue';
  totalPrice: number;
  penalty: number;
}

export interface CreateLoanPayload {
  gameId: number;
  clientId: number;
  startDate?: Date;
  endDate?: Date;
}

export interface UpdateLoanPayload {
  id: number;
  startDate?: Date;
  endDate?: Date;
  status?: string;
}
