import { Injectable, signal } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, take } from 'rxjs';
import { GET_LOANS, CREATE_LOAN, UPDATE_LOAN, RETURN_LOAN, REMOVE_LOAN } from '../../graphql/loans.graphql';
import type { Loan, CreateLoanPayload, UpdateLoanPayload } from './interfaces/loan.interface';

interface GetLoansResponse { loans: Loan[] }

@Injectable({ providedIn: 'root' })
export class LoansService {

  constructor(private readonly apollo: Apollo) {}

  private readonly _loans = signal<Loan[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly loans = this._loans.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  loadLoans(): void {
    this._loading.set(true);
    this._error.set(null);

    this.apollo
      .query<GetLoansResponse>({
        query: GET_LOANS,
        variables: { offset: 0, limit: 100 },
        fetchPolicy: 'network-only',
      })
      .pipe(take(1))
      .subscribe({
        next: ({ data }) => {
          this._loans.set((data?.loans ?? []) as Loan[]);
          this._loading.set(false);
        },
        error: (err: Error) => {
          this._error.set(err.message ?? 'Error al cargar los préstamos');
          this._loading.set(false);
        },
      });
  }

  createLoan(payload: CreateLoanPayload): Observable<unknown> {
    return this.apollo.mutate({
      mutation: CREATE_LOAN,
      variables: { input: payload },
    });
  }

  updateLoan(payload: UpdateLoanPayload): Observable<unknown> {
    return this.apollo.mutate({
      mutation: UPDATE_LOAN,
      variables: { input: payload },
    });
  }

  returnLoan(id: number): Observable<unknown> {
    return this.apollo.mutate({
      mutation: RETURN_LOAN,
      variables: { id },
    });
  }

  removeLoan(id: number): Observable<unknown> {
    return this.apollo.mutate({
      mutation: REMOVE_LOAN,
      variables: { id },
    });
  }
}
