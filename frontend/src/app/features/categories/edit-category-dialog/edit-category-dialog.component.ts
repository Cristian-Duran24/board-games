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
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LucideAngularModule, X } from 'lucide-angular';

import { CategoriesService } from '../categories.service';
import type { Category } from '../interfaces/category.interface';

export interface EditCategoryDialogData {
  category: Category;
}

@Component({
  selector: 'app-edit-category-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    LucideAngularModule,
  ],
  templateUrl: './edit-category-dialog.component.html',
})
export class EditCategoryDialogComponent implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<EditCategoryDialogComponent>);
  readonly dialogData = inject<EditCategoryDialogData>(MAT_DIALOG_DATA);
  private readonly categoriesService = inject(CategoriesService);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly iconClose = X;
  protected readonly submitting = signal(false);
  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.dialogData.category.name, [Validators.required, Validators.minLength(3)]],
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    if (this.form.invalid || this.submitting()) return;

    this.submitting.set(true);
    const { name } = this.form.value as { name: string };

    this.categoriesService.updateCategory({
      id: this.dialogData.category.id,
      name: name.trim(),
    }).subscribe({
      next: () => {
        this.snackBar.open('Categoría actualizada correctamente.', 'Cerrar', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (err: Error) => {
        this.snackBar.open(err.message ?? 'Error al actualizar la categoría.', 'Cerrar', { duration: 4000 });
        this.submitting.set(false);
      },
    });
  }
}
