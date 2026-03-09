import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LucideAngularModule, X } from 'lucide-angular';
import { LoansService } from '../loans.service';
import { GamesService } from '../../games/games.service';
import { ClientsService } from '../../clients/clients.service';

@Component({
  selector: 'app-create-loan-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    LucideAngularModule,
  ],
  templateUrl: './create-loan-dialog.component.html',
})
export class CreateLoanDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CreateLoanDialogComponent>);
  private readonly loansService = inject(LoansService);
  protected readonly gamesService = inject(GamesService);
  protected readonly clientsService = inject(ClientsService);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly iconClose = X;
  protected readonly submitting = signal(false);
  form!: FormGroup;

  /** Juegos con stock disponible */
  protected readonly availableGames = computed(() =>
    this.gamesService.games().filter(g => g.inStock > 0)
  );

  /** Fecha mínima para startDate (hoy) */
  protected readonly minStartDate = (() => {
    const today = new Date();
    return today.toLocaleDateString('en-CA'); // yyyy-MM-dd en locale local
  })();

  /** Fecha mínima para endDate: un día después del startDate seleccionado */
  protected get minEndDate(): string {
    const startVal = this.form?.get('startDate')?.value;
    const base = startVal ? new Date(startVal + 'T12:00:00') : new Date();
    const next = new Date(base);
    next.setDate(next.getDate() + 1);
    return next.toLocaleDateString('en-CA');
  }

  /** Precio calculado reactivo = días × precio juego */
  protected readonly calculatedPrice = computed(() => {
    const gameId = Number(this.form?.get('gameId')?.value);
    const startDateVal = this.form?.get('startDate')?.value;
    const endDateVal = this.form?.get('endDate')?.value;
    if (!gameId || !endDateVal) return null;

    const game = this.gamesService.games().find(g => g.id === gameId);
    if (!game) return null;

    const start = startDateVal ? new Date(startDateVal + 'T12:00:00') : new Date();
    const end = new Date(endDateVal + 'T12:00:00');
    if (end <= start) return null;

    const diffMs = end.getTime() - start.getTime();
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const total = (days >= 1 ? days : 1) * game.price;
    return { days: days >= 1 ? days : 1, total };
  });

  ngOnInit(): void {
    this.gamesService.loadGames();
    this.clientsService.loadClients();

    this.form = this.fb.group({
      gameId:    [null, [Validators.required]],
      clientId:  [null, [Validators.required]],
      startDate: [this.minStartDate, [Validators.required]],
      endDate:   ['', [Validators.required]],
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    if (this.form.invalid || this.submitting()) return;
    this.submitting.set(true);

    const { gameId, clientId, startDate, endDate } = this.form.value;
    // Append T12:00:00 so JS parses as local noon, avoiding UTC-midnight day shift
    const payload = {
      gameId: Number(gameId),
      clientId: Number(clientId),
      startDate: new Date(startDate + 'T12:00:00'),
      endDate: new Date(endDate + 'T12:00:00'),
    };

    this.loansService.createLoan(payload).subscribe({
      next: () => {
        this.snackBar.open('Préstamo creado correctamente', 'Cerrar', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (err: Error) => {
        this.snackBar.open(err.message ?? 'Error al crear el préstamo', 'Cerrar', { duration: 4000 });
        this.submitting.set(false);
      },
    });
  }
}
