import {
  Component,
  OnInit,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LucideAngularModule, X } from 'lucide-angular';

import { CategoriesService } from '../categories.service';

@Component({
  selector: 'app-create-category-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    LucideAngularModule,
  ],
  templateUrl: './create-category-dialog.component.html',
})
export class CreateCategoryDialogComponent implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CreateCategoryDialogComponent>);
  private readonly categoriesService = inject(CategoriesService);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly iconClose = X;
  protected readonly submitting = signal(false);
  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    if (this.form.invalid || this.submitting()) return;

    this.submitting.set(true);
    const { name } = this.form.value as { name: string };

    this.categoriesService.createCategory({ name: name.trim() }).subscribe({
      next: () => {
        this.snackBar.open('Categoría creada correctamente.', 'Cerrar', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (err: Error) => {
        this.snackBar.open(err.message ?? 'Error al crear la categoría.', 'Cerrar', { duration: 4000 });
        this.submitting.set(false);
      },
    });
  }
}
