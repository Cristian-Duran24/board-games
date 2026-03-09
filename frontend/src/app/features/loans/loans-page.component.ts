import { Component, OnInit, AfterViewInit, DestroyRef, inject, signal, computed, effect, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { take } from 'rxjs';
import { DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LucideAngularModule, Search, Plus, MoreVertical, Pencil, Trash2, RotateCcw, CalendarDays } from 'lucide-angular';
import { LoansService } from './loans.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CreateLoanDialogComponent } from './create-loan-dialog/create-loan-dialog.component';
import { EditLoanDialogComponent, type EditLoanDialogData } from './edit-loan-dialog/edit-loan-dialog.component';
import { ConfirmDialogComponent, type ConfirmDialogData } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import type { Loan } from './interfaces/loan.interface';

type StatusFilter = 'all' | 'active' | 'returned' | 'overdue';

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
  selector: 'app-loans-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: MatPaginatorIntl, useClass: SpanishPaginatorIntl },
    DatePipe,
  ],
  imports: [
    DatePipe,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    LucideAngularModule,
    ButtonComponent,
  ],
  templateUrl: './loans-page.component.html',
})
export class LoansPageComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) private readonly paginator!: MatPaginator;

  protected readonly loansService = inject(LoansService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  protected readonly iconSearch = Search;
  protected readonly iconPlus = Plus;
  protected readonly iconMoreVertical = MoreVertical;
  protected readonly iconPencil = Pencil;
  protected readonly iconTrash = Trash2;
  protected readonly iconReturn = RotateCcw;
  protected readonly iconCalendar = CalendarDays;

  protected readonly displayedColumns = ['index', 'game', 'client', 'dates', 'status', 'totalPrice', 'actions'];
  protected readonly dataSource = new MatTableDataSource<Loan>([]);
  protected readonly searchQuery = signal('');
  protected readonly activeFilter = signal<StatusFilter>('all');
  protected readonly openMenuId = signal<number | null>(null);
  protected readonly menuPosition = signal<{ top: number; right: number } | null>(null);

  protected readonly activeCount = computed(() =>
    this.loansService.loans().filter(l => l.status === 'active').length
  );
  protected readonly returnedCount = computed(() =>
    this.loansService.loans().filter(l => l.status === 'returned').length
  );
  protected readonly overdueCount = computed(() =>
    this.loansService.loans().filter(l => l.status === 'overdue').length
  );

  private static readonly AVATAR_COLORS = [
    '#1D4ED8', '#065F46', '#7C3AED', '#B45309', '#9D174D', '#0F766E',
  ];

  constructor() {
    effect(() => {
      this.dataSource.data = this.loansService.loans();
      this.cdr.markForCheck();
    });
    effect(() => {
      this.dataSource.filter = JSON.stringify({
        tab: this.activeFilter(),
        query: this.searchQuery().trim().toLowerCase(),
      });
      if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
      this.cdr.markForCheck();
    });
  }

  ngOnInit(): void {
    this.loansService.loadLoans();
    this.dataSource.filterPredicate = (loan, filterStr) => {
      if (!filterStr) return true;
      const { tab, query } = JSON.parse(filterStr) as { tab: StatusFilter; query: string };
      if (tab !== 'all' && loan.status !== tab) return false;
      if (!query) return true;
      return (
        loan.game.title.toLowerCase().includes(query) ||
        loan.client.name.toLowerCase().includes(query)
      );
    };
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
    return LoansPageComponent.AVATAR_COLORS[id % LoansPageComponent.AVATAR_COLORS.length];
  }

  protected isReturnable(loan: Loan): boolean {
    return loan.status === 'active' || loan.status === 'overdue';
  }

  protected formatMoney(amount: number): string {
    return `Bs. ${Number(amount).toFixed(2)}`;
  }

  protected getGameImage(image?: string): string {
    if (!image) return '';
    return image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}`;
  }

  protected getTabClass(tab: StatusFilter): string {
    const base = 'px-4 py-1.5 rounded-full text-sm font-medium transition-all border ';
    return this.activeFilter() === tab
      ? base + 'bg-subtle text-text-primary border-border-default'
      : base + 'text-text-secondary border-border-default/50 hover:text-text-primary hover:border-border-default';
  }

  // ── Menu ────────────────────────────────────────────────────────────────────

  toggleMenu(event: MouseEvent, loanId: number): void {
    event.stopPropagation();
    const btn = (event.currentTarget as HTMLElement).getBoundingClientRect();
    if (this.openMenuId() === loanId) {
      this.openMenuId.set(null);
      this.menuPosition.set(null);
    } else {
      this.openMenuId.set(loanId);
      this.menuPosition.set({ top: btn.bottom + 4, right: window.innerWidth - btn.right });
    }
  }

  closeMenu(): void {
    this.openMenuId.set(null);
    this.menuPosition.set(null);
  }

  // ── CRUD ────────────────────────────────────────────────────────────────────

  openCreateDialog(): void {
    this.dialog.open(CreateLoanDialogComponent, { width: '520px', maxWidth: '95vw' })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((ok: boolean) => { if (ok) this.loansService.loadLoans(); });
  }

  openEditDialog(loan: Loan): void {
    const data: EditLoanDialogData = { loan };
    this.dialog.open(EditLoanDialogComponent, { data, width: '480px', maxWidth: '95vw' })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((ok: boolean) => { if (ok) this.loansService.loadLoans(); });
  }

  openReturnDialog(loan: Loan): void {
    const data: ConfirmDialogData = {
      title: 'Devolver juego',
      message: `¿Confirmas la devolución de "${loan.game.title}" por parte de ${loan.client.name}?`,
      confirmLabel: 'Confirmar devolución',
      cancelLabel: 'Cancelar',
    };
    this.dialog.open(ConfirmDialogComponent, { data, width: '400px', maxWidth: '95vw' })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed: boolean) => {
        if (!confirmed) return;
        this.loansService.returnLoan(loan.id).pipe(take(1)).subscribe({
          next: () => {
            this.snackBar.open('Juego devuelto correctamente', 'Cerrar', { duration: 3000 });
            this.loansService.loadLoans();
          },
          error: (err: Error) => {
            this.snackBar.open(err.message ?? 'Error al devolver el juego', 'Cerrar', { duration: 4000 });
          },
        });
      });
  }

  openDeleteDialog(loan: Loan): void {
    const data: ConfirmDialogData = {
      title: 'Eliminar préstamo',
      message: `¿Estás seguro de que deseas eliminar el préstamo de "${loan.game.title}"? Esta acción no se puede deshacer.`,
      confirmLabel: 'Eliminar',
      cancelLabel: 'Cancelar',
    };
    this.dialog.open(ConfirmDialogComponent, { data, width: '400px', maxWidth: '95vw' })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed: boolean) => {
        if (!confirmed) return;
        this.loansService.removeLoan(loan.id).pipe(take(1)).subscribe({
          next: () => {
            this.snackBar.open('Préstamo eliminado correctamente', 'Cerrar', { duration: 3000 });
            this.loansService.loadLoans();
          },
          error: (err: Error) => {
            this.snackBar.open(err.message ?? 'Error al eliminar el préstamo', 'Cerrar', { duration: 4000 });
          },
        });
      });
  }
}
