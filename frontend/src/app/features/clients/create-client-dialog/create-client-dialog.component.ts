import {
  Component,
  OnInit,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LucideAngularModule, X } from 'lucide-angular';
import { ClientsService } from '../clients.service';

@Component({
  selector: 'app-create-client-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    LucideAngularModule,
  ],
  templateUrl: './create-client-dialog.component.html',
})
export class CreateClientDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CreateClientDialogComponent>);
  private readonly clientsService = inject(ClientsService);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly iconClose = X;
  protected readonly submitting = signal(false);
  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      name:  ['', [Validators.required, Validators.minLength(4)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+591[67]\d{7}$/)]],
      email: ['', [Validators.email]],
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    if (this.form.invalid || this.submitting()) return;
    this.submitting.set(true);

    const { name, phone, email } = this.form.value;
    const payload = { name: name.trim(), phone, ...(email?.trim() ? { email: email.trim() } : {}) };

    this.clientsService.createClient(payload).subscribe({
      next: () => {
        this.snackBar.open('Cliente creado correctamente', 'Cerrar', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (err: Error) => {
        this.snackBar.open(err.message ?? 'Error al crear el cliente', 'Cerrar', { duration: 4000 });
        this.submitting.set(false);
      },
    });
  }
}
