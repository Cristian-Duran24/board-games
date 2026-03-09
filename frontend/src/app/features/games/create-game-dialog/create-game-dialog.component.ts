import { Component, OnInit, inject, signal, ChangeDetectionStrategy} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LucideAngularModule, X, Image } from 'lucide-angular';

import { GamesService } from '../games.service';
import type { Category } from '../interfaces/game.interface';

export interface CreateGameDialogData {
  categories: Category[];
}

@Component({
  selector: 'app-create-game-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    LucideAngularModule,
  ],
  templateUrl: './create-game-dialog.component.html',
})

export class CreateGameDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CreateGameDialogComponent>);
  readonly dialogData = inject<CreateGameDialogData>(MAT_DIALOG_DATA);
  private readonly gamesService = inject(GamesService);
  private readonly snackBar = inject(MatSnackBar);
  protected readonly iconClose = X;
  protected readonly iconImage = Image;
  protected readonly submitting = signal(false);
  protected readonly imagePreview = signal<string | null>(null);
  private imageBase64: string | undefined = undefined;

  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      categoryId: [null, [Validators.required]],
      price: [null, [Validators.required, Validators.min(0.01)]],
      inTotal: [null, [Validators.required, Validators.min(1)]],
      playersMin: [null, [Validators.min(1)]],
      playersMax: [null, [Validators.min(1)]],
      duration: [null, [Validators.min(1)]],
    });
  }

  /** Lee el archivo, extrae Base64 puro y genera preview */
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    // Validar tipo MIME
    if (!file.type.startsWith('image/')) {
      this.snackBar.open('Solo se permiten archivos de imagen.', 'Cerrar', { duration: 3000 });
      return;
    }

    // Validar tamaño máximo 2 MB
    if (file.size > 2 * 1024 * 1024) {
      this.snackBar.open('La imagen no puede superar los 2 MB.', 'Cerrar', { duration: 3000 });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      // Separar "data:image/png;base64," de la parte pura
      this.imageBase64 = dataUrl.split(',')[1];
      // Guardar el dataUrl completo solo para el preview visual
      this.imagePreview.set(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  /** Limpia la imagen seleccionada */
  clearImage(): void {
    this.imageBase64 = undefined;
    this.imagePreview.set(null);
  }

  onSubmit(): void {
    if (this.form.invalid || this.submitting()) return;

    this.submitting.set(true);

    const raw = this.form.getRawValue();

    const payload = {
      title: raw.title.trim(),
      categoryId: raw.categoryId,
      price: Number(raw.price),
      inTotal: Number(raw.inTotal),
      // Opcionales: solo se envían si tienen valor
      ...(this.imageBase64 && { image: this.imageBase64 }),
      ...(raw.playersMin !== null && { playersMin: Number(raw.playersMin) }),
      ...(raw.playersMax !== null && { playersMax: Number(raw.playersMax) }),
      ...(raw.duration !== null && { duration: Number(raw.duration) }),
    };

    this.gamesService.createGame(payload).subscribe({
      next: () => {
        this.submitting.set(false);
        this.snackBar.open('¡Juego creado exitosamente!', 'Cerrar', {
          duration: 3000,
          panelClass: ['snack-success'],
        });
        this.dialogRef.close(true);
      },
      error: (err: Error) => {
        this.submitting.set(false);
        this.snackBar.open(
          err.message ?? 'Error al crear el juego. Intenta de nuevo.',
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
