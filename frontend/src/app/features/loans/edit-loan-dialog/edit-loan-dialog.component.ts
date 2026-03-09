import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LucideAngularModule, X } from 'lucide-angular';
import { LoansService } from '../loans.service';
import type { Loan } from '../interfaces/loan.interface';

export interface EditLoanDialogData {
  loan: Loan;
}

@Component({
  selector: 'app-edit-loan-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    LucideAngularModule,
  ],
  templateUrl: './edit-loan-dialog.component.html',
})
export class EditLoanDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<EditLoanDialogComponent>);
  protected readonly data = inject<EditLoanDialogData>(MAT_DIALOG_DATA);
  private readonly loansService = inject(LoansService);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly iconClose = X;
  protected readonly submitting = signal(false);
  form!: FormGroup;

  /** Convierte una fecha ISO/Date a formato yyyy-MM-dd para input[type=date] usando UTC para evitar desfase de zona horaria */
  private toDateInput(date: string | Date): string {
    const d = new Date(date);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  ngOnInit(): void {
    const { startDate, endDate } = this.data.loan;
    this.form = this.fb.group({
      startDate: [this.toDateInput(startDate), [Validators.required]],
      endDate:   [this.toDateInput(endDate),   [Validators.required]],
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    if (this.form.invalid || this.submitting()) return;
    this.submitting.set(true);

    const { startDate, endDate } = this.form.value;

    if (new Date(endDate) <= new Date(startDate)) {
      this.snackBar.open('La fecha de fin debe ser posterior a la de inicio', 'Cerrar', { duration: 4000 });
      this.submitting.set(false);
      return;
    }

    const payload = {
      id: this.data.loan.id,
      startDate: new Date(startDate + 'T12:00:00'),
      endDate: new Date(endDate + 'T12:00:00'),
    };

    this.loansService.updateLoan(payload).subscribe({
      next: () => {
        this.snackBar.open('Préstamo actualizado correctamente', 'Cerrar', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (err: Error) => {
        this.snackBar.open(err.message ?? 'Error al actualizar el préstamo', 'Cerrar', { duration: 4000 });
        this.submitting.set(false);
      },
    });
  }
}
