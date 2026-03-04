import {
  Component,
  OnInit,
  DestroyRef,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LucideAngularModule, Plus, Pencil, Trash2, Tag } from 'lucide-angular';

import { CategoriesService } from './categories.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CreateCategoryDialogComponent } from './create-category-dialog/create-category-dialog.component';
import {
  EditCategoryDialogComponent,
  type EditCategoryDialogData,
} from './edit-category-dialog/edit-category-dialog.component';
import {
  ConfirmDialogComponent,
  type ConfirmDialogData,
} from '../../shared/components/confirm-dialog/confirm-dialog.component';
import type { Category } from './interfaces/category.interface';

@Component({
  selector: 'app-categories-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    LucideAngularModule,
    ButtonComponent,
  ],
  templateUrl: './categories-page.component.html',
})
export class CategoriesPageComponent implements OnInit {

  protected readonly categoriesService = inject(CategoriesService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  // Iconos Lucide
  protected readonly iconPlus = Plus;
  protected readonly iconPencil = Pencil;
  protected readonly iconTrash = Trash2;
  protected readonly iconTag = Tag;

  ngOnInit(): void {
    this.categoriesService.loadCategories();
  }

  /** Abre el dialog de creación de categoría */
  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateCategoryDialogComponent, {
      width: '480px',
      maxWidth: '95vw',
      disableClose: false,
    });

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.categoriesService.loadCategories();
        }
      });
  }

  /** Abre el dialog de edición de categoría */
  openEditDialog(category: Category): void {
    const data: EditCategoryDialogData = { category };

    const dialogRef = this.dialog.open(EditCategoryDialogComponent, {
      data,
      width: '480px',
      maxWidth: '95vw',
      disableClose: false,
    });

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.categoriesService.loadCategories();
        }
      });
  }

  /** Abre el dialog de confirmación y elimina la categoría si se confirma */
  openDeleteDialog(category: Category): void {
    const data: ConfirmDialogData = {
      title: 'Eliminar categoría',
      message: `¿Estás seguro de que quieres eliminar la categoría "${category.name}"? Esta acción no se puede deshacer.`,
      confirmLabel: 'Eliminar',
      cancelLabel: 'Cancelar',
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data,
      width: '420px',
      maxWidth: '95vw',
      disableClose: false,
    });

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.categoriesService.removeCategory(category.id).subscribe({
            next: () => {
              this.snackBar.open('Categoría eliminada correctamente.', 'Cerrar', { duration: 3000 });
              this.categoriesService.loadCategories();
            },
            error: (err: Error) => {
              this.snackBar.open(err.message ?? 'Error al eliminar la categoría.', 'Cerrar', { duration: 4000 });
            },
          });
        }
      });
  }
}
