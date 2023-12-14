import { ChangeDetectorRef, Component, SimpleChanges, computed, inject, signal } from '@angular/core';
import { switchMap, tap } from 'rxjs';
import { Trial } from 'src/app/frutyfest/interfaces/trial.interface';
import { FrutyfestService } from 'src/app/frutyfest/services/frutyfest.service';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './trial-table.component.html',
  styleUrls: ['./trial-table.component.scss']
})
export class TrialTableComponent {
  private frutyfestService = inject(FrutyfestService);
  private _trials = signal<Trial[] | undefined>(undefined);
  public trials = computed(() => this._trials());

  constructor(private cdr: ChangeDetectorRef) {
    this.getTrials();
  }

  ngOnInit(): void {
    this.frutyfestService.setPage('admin');
  }

  ngOnDestroy(): void {
    this.frutyfestService.setPage('');
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Trigger a change detection cycle to repaint the HTML
    this.cdr.detectChanges();
  }

  getTrials(): void {
    this.frutyfestService.getTrials().subscribe({
      next: (trials) => {
        this._trials.set(trials);
        // Trigger ngOnChanges to repaint the HTML
        this.ngOnChanges({});
      },
      error: (message) => {
      }
    });
  }

  removeTrial(id: string | null): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.frutyfestService.getTrial(id!).pipe(
          switchMap(() => this.frutyfestService.removeTrial(id!)),
          tap(() => this.getTrials())
        ).subscribe();
      }
    });
  }
}
