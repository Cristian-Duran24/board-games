import { Injectable, signal } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, take } from 'rxjs';
import { GET_CLIENTS, CREATE_CLIENT, UPDATE_CLIENT, REMOVE_CLIENT } from '../../graphql/clients.graphql';
import type { Client, CreateClientPayload, UpdateClientPayload } from './interfaces/client.interface';

interface GetClientsResponse { clients: Client[] }

@Injectable({ providedIn: 'root' })
export class ClientsService {

  constructor(private readonly apollo: Apollo) {}

  private readonly _clients = signal<Client[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly clients = this._clients.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  loadClients(): void {
    this._loading.set(true);
    this._error.set(null);

    this.apollo
      .query<GetClientsResponse>({
        query: GET_CLIENTS,
        variables: { offset: 0, limit: 100 },
        fetchPolicy: 'network-only',
      })
      .pipe(take(1))
      .subscribe({
        next: ({ data }) => {
          this._clients.set((data?.clients ?? []) as Client[]);
          this._loading.set(false);
        },
        error: (err: Error) => {
          this._error.set(err.message ?? 'Error al cargar los clientes');
          this._loading.set(false);
        },
      });
  }

  createClient(payload: CreateClientPayload): Observable<unknown> {
    return this.apollo.mutate({
      mutation: CREATE_CLIENT,
      variables: { input: payload },
    });
  }

  updateClient(payload: UpdateClientPayload): Observable<unknown> {
    return this.apollo.mutate({
      mutation: UPDATE_CLIENT,
      variables: { input: payload },
    });
  }

  removeClient(id: number): Observable<unknown> {
    return this.apollo.mutate({
      mutation: REMOVE_CLIENT,
      variables: { id },
    });
  }
}
