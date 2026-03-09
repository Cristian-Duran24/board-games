export interface ClientLoan {
  id: number;
  status: string;
}

export interface Client {
  id: number;
  name: string;
  phone: string;
  email?: string;
  loans?: ClientLoan[];
}

export interface CreateClientPayload {
  name: string;
  phone: string;
  email?: string;
}

export interface UpdateClientPayload {
  id: number;
  name?: string;
  phone?: string;
  email?: string;
}
