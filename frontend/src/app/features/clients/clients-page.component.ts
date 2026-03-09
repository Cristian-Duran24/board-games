import {
  Component,
  OnInit,
  AfterViewInit,
  DestroyRef,
  inject,
  signal,
  effect,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { take } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LucideAngularModule, Search, Plus, MoreVertical, Pencil, Trash2 } from 'lucide-angular';
import { ClientsService } from './clients.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CreateClientDialogComponent } from './create-client-dialog/create-client-dialog.component';
import { EditClientDialogComponent, type EditClientDialogData } from './edit-client-dialog/edit-client-dialog.component';
import { ConfirmDialogComponent, type ConfirmDialogData } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import type { Client } from './interfaces/client.interface';

/** Paginator con etiquetas en español */
class SpanishPaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Por página:';
  override nextPageLabel = 'Siguiente';
  override previousPageLabel = 'Anterior';
  override firstPageLabel = 'Primera página';
  override lastPageLabel = 'Última página';
  override getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0) return 'Página 1 de 1';
    return `Página ${page + 1} de ${Math.ceil(length / pageSize)}`;
  };
}

@Component({
  selector: 'app-clients-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: MatPaginatorIntl, useClass: SpanishPaginatorIntl }],
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    LucideAngularModule,
    ButtonComponent,
  ],
  templateUrl: './clients-page.component.html',
})
export class ClientsPageComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) private readonly paginator!: MatPaginator;

  protected readonly clientsService = inject(ClientsService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  protected readonly iconSearch = Search;
  protected readonly iconPlus = Plus;
  protected readonly iconMoreVertical = MoreVertical;
  protected readonly iconPencil = Pencil;
  protected readonly iconTrash = Trash2;

  protected readonly displayedColumns = ['index', 'client', 'phone', 'email', 'activeLoans', 'totalLoans', 'actions'];
  protected readonly dataSource = new MatTableDataSource<Client>([]);
  protected readonly searchQuery = signal('');
  protected readonly openMenuId = signal<number | null>(null);
  protected readonly menuPosition = signal<{ top: number; right: number } | null>(null);

  private static readonly AVATAR_COLORS = [
    '#1D4ED8', '#065F46', '#7C3AED', '#B45309', '#9D174D', '#0F766E',
  ];

  constructor() {
    effect(() => {
      this.dataSource.data = this.clientsService.clients();
      this.cdr.markForCheck();
    });
    effect(() => {
      this.dataSource.filter = this.searchQuery().trim().toLowerCase();
      if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
      this.cdr.markForCheck();
    });
  }

  ngOnInit(): void {
    this.clientsService.loadClients();
    this.dataSource.filterPredicate = (client, filter) =>
      client.name.toLowerCase().includes(filter) ||
      client.phone.includes(filter) ||
      (client.email?.toLowerCase().includes(filter) ?? false);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  protected getInitials(name: string): string {
    const words = name.trim().split(/\s+/);
    return words.length >= 2
      ? `${words[0][0]}${words[1][0]}`.toUpperCase()
      : name.slice(0, 2).toUpperCase();
  }

  protected getAvatarBg(id: number): string {
    return ClientsPageComponent.AVATAR_COLORS[id % ClientsPageComponent.AVATAR_COLORS.length];
  }

  protected getActiveLoansCount(client: Client): number {
    return client.loans?.filter(l => l.status === 'active').length ?? 0;
  }

  protected getTotalLoansCount(client: Client): number {
    return client.loans?.length ?? 0;
  }

  // ── Menu ────────────────────────────────────────────────────────────────────

  toggleMenu(event: MouseEvent, clientId: number): void {
    event.stopPropagation();
    const btn = (event.currentTarget as HTMLElement).getBoundingClientRect();
    if (this.openMenuId() === clientId) {
      this.openMenuId.set(null);
      this.menuPosition.set(null);
    } else {
      this.openMenuId.set(clientId);
      this.menuPosition.set({ top: btn.bottom + 4, right: window.innerWidth - btn.right });
    }
  }

  closeMenu(): void {
    this.openMenuId.set(null);
    this.menuPosition.set(null);
  }

  // ── CRUD ────────────────────────────────────────────────────────────────────

  openCreateDialog(): void {
    this.dialog.open(CreateClientDialogComponent, { width: '480px', maxWidth: '95vw' })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((ok: boolean) => { if (ok) this.clientsService.loadClients(); });
  }

  openEditDialog(client: Client): void {
    const data: EditClientDialogData = { client };
    this.dialog.open(EditClientDialogComponent, { data, width: '480px', maxWidth: '95vw' })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((ok: boolean) => { if (ok) this.clientsService.loadClients(); });
  }

  openDeleteDialog(client: Client): void {
    const data: ConfirmDialogData = {
      title: 'Eliminar cliente',
      message: `¿Estás seguro de que deseas eliminar a "${client.name}"? Esta acción no se puede deshacer.`,
      confirmLabel: 'Eliminar',
      cancelLabel: 'Cancelar',
    };
    this.dialog.open(ConfirmDialogComponent, { data, width: '400px', maxWidth: '95vw' })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed: boolean) => {
        if (!confirmed) return;
        this.clientsService.removeClient(client.id).pipe(take(1)).subscribe({
          next: () => {
            this.snackBar.open('Cliente eliminado correctamente', 'Cerrar', { duration: 3000 });
            this.clientsService.loadClients();
          },
          error: (err: Error) => {
            this.snackBar.open(err.message ?? 'Error al eliminar el cliente', 'Cerrar', { duration: 4000 });
          },
        });
      });
  }
}
