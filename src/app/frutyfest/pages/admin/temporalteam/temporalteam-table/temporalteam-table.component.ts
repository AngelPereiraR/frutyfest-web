import { ChangeDetectorRef, Component, SimpleChanges, computed, inject, signal } from '@angular/core';
import { switchMap, forkJoin, tap, catchError, EMPTY, interval } from 'rxjs';
import { Temporal, TemporalTeam } from 'src/app/frutyfest/interfaces/temporal.interface';
import { FrutyfestService } from 'src/app/frutyfest/services/frutyfest.service';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './temporalteam-table.component.html',
  styleUrls: ['./temporalteam-table.component.scss']
})
export class TemporalteamTableComponent {
  private frutyfestService = inject(FrutyfestService);
  private _temporals = signal<TemporalTeam[] | undefined>(undefined);
  public temporals = computed(() => this._temporals());

  constructor(private cdr: ChangeDetectorRef) {
    this.getTemporals();
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

  getTemporals(): void {
    this.frutyfestService.getTemporals().subscribe({
      next: (temporals) => {
        this._temporals.set(temporals);
        // Trigger ngOnChanges to repaint the HTML
        this.ngOnChanges({});
      },
      error: (message) => {
      }
    });
  }

  removeTemporal(id: string | null): void {
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
        this.frutyfestService.getTemporal(id!).pipe(
          switchMap((temporal) => {
            // Trigger ngOnChanges to repaint the HTML
            this.ngOnChanges({});
            return forkJoin(
              temporal.teams.map(team => {
                return this.frutyfestService.removeSelectedOnTemporal(team._id)
                  .pipe(
                    catchError(error => {
                      console.error('Error removing team:', team._id, error);
                      return EMPTY;
                    })
                  );
              })
            );
          }),
          switchMap(() => this.frutyfestService.removeTemporal(id!)),
          tap(() => this.getTemporals())
        ).subscribe();
      }
    });
  }

  getTeam(id: string) {
    this.frutyfestService.getTeam(id).subscribe({
      next: (team) => {
        return team.color;
      }
    });
  }
}
