import {
  Component,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

/** Datos que recibe el dialog de confirmación */
export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule],
  template: `
    <div class="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
      <h2 class="text-xl font-bold text-text-primary">{{ data.title }}</h2>
    </div>
    <div class="px-6 py-5">
      <p class="text-text-secondary text-sm">{{ data.message }}</p>
    </div>
    <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-subtle">
      <button type="button"
        class="px-5 py-2.5 rounded-xl text-sm font-medium text-text-secondary border border-border-default hover:bg-subtle/30 transition-colors cursor-pointer"
        (click)="onCancel()">
        {{ data.cancelLabel ?? 'Cancelar' }}
      </button>
      <button type="button"
        class="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-danger hover:bg-danger/90 transition-colors cursor-pointer"
        (click)="onConfirm()">
        {{ data.confirmLabel ?? 'Confirmar' }}
      </button>
    </div>
  `,
})
export class ConfirmDialogComponent {
  protected readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
