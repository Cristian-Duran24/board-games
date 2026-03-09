import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LucideAngularModule, X, Image } from 'lucide-angular';

import { GamesService } from '../games.service';
import type { Category, Game } from '../interfaces/game.interface';

export interface EditGameDialogData {
  game: Game;
  categories: Category[];
}

@Component({
  selector: 'app-edit-game-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    LucideAngularModule,
  ],
  templateUrl: './edit-game-dialog.component.html',
})
export class EditGameDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<EditGameDialogComponent>);
  readonly dialogData = inject<EditGameDialogData>(MAT_DIALOG_DATA);
  private readonly gamesService = inject(GamesService);
  private readonly snackBar = inject(MatSnackBar);
  protected readonly iconClose = X;
  protected readonly iconImage = Image;
  protected readonly submitting = signal(false);
  /** Preview de la imagen: comienza con la existente si la hay */
  protected readonly imagePreview = signal<string | null>(null);
  /** Base64 puro del nuevo archivo subido; undefined = sin cambios */
  private newImageBase64: string | undefined = undefined;

  form!: FormGroup;

  ngOnInit(): void {
    const g = this.dialogData.game;

    this.form = this.fb.group({
      title: [g.title, [Validators.required, Validators.minLength(5)]],
      categoryId: [g.category.id, [Validators.required]],
      price: [g.price, [Validators.required, Validators.min(0.01)]],
      inTotal: [g.inTotal, [Validators.required, Validators.min(1)]],
      playersMin: [g.playersMin ?? null, [Validators.min(1)]],
      playersMax: [g.playersMax ?? null, [Validators.min(1)]],
      duration: [g.duration ?? null, [Validators.min(1)]],
    });

    if (g.image) {
      this.imagePreview.set(`data:image/png;base64,${g.image}`);
    }
  }

  /** Lee el archivo, extrae Base64 puro y genera preview */
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.snackBar.open('Solo se permiten archivos de imagen.', 'Cerrar', { duration: 3000 });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.snackBar.open('La imagen no puede superar los 2 MB.', 'Cerrar', { duration: 3000 });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      this.newImageBase64 = dataUrl.split(',')[1];
      this.imagePreview.set(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  clearImage(): void {
    this.newImageBase64 = undefined;
    this.imagePreview.set(null);
  }

  onSubmit(): void {
    if (this.form.invalid || this.submitting()) return;

    this.submitting.set(true);
    const raw = this.form.getRawValue();

    const payload = {
      id: this.dialogData.game.id,
      title: (raw.title as string).trim(),
      categoryId: Number(raw.categoryId),
      price: Number(raw.price),
      inTotal: Number(raw.inTotal),
      ...(this.newImageBase64 && { image: this.newImageBase64 }),
      ...(raw.playersMin !== null && { playersMin: Number(raw.playersMin) }),
      ...(raw.playersMax !== null && { playersMax: Number(raw.playersMax) }),
      ...(raw.duration !== null && { duration: Number(raw.duration) }),
    };

    this.gamesService.updateGame(payload).subscribe({
      next: () => {
        this.submitting.set(false);
        this.snackBar.open('Juego actualizado correctamente.', 'Cerrar', {
          duration: 3000,
          panelClass: ['snack-success'],
        });
        this.dialogRef.close(true);
      },
      error: (err: Error) => {
        this.submitting.set(false);
        this.snackBar.open(
          err.message ?? 'Error al actualizar el juego.',
          'Cerrar',
          { duration: 4000 }
        );
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
