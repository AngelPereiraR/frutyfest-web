import {
  ChangeDetectorRef,
  Component,
  SimpleChanges,
  computed,
  inject,
  signal,
} from '@angular/core';
import { switchMap, tap } from 'rxjs';
import { Trial } from 'src/app/frutyfest/interfaces/trial.interface';
import { FrutyfestService } from 'src/app/frutyfest/services/frutyfest.service';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './trial-table.component.html',
  styleUrls: ['./trial-table.component.scss'],
})
export class TrialTableComponent {
  private frutyfestService = inject(FrutyfestService);
  private _trials = signal<Trial[] | undefined>(undefined);
  public trials = computed(() => this._trials());
  public loading: boolean = false;
  public firstLoading: boolean = false;
  private _position = signal<number>(0);
  public position = computed(() => this._position());
  private _totalTrials = signal<number>(0);
  public totalTrials = computed(() => this._totalTrials());
  public totalPages: number = 0;

  constructor(private cdr: ChangeDetectorRef) {
    this.firstLoading = true;
    this.getTrials(this.position());
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

  getPageNumbers(): number[] {
    this.totalPages = Math.ceil(this.totalTrials() / 8);
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  getTrials(position: number): void {
    this.loading = true;
    if(position <= this.totalPages - 1 && position >= 0) {
      this._position.set(position);
    }
    this.frutyfestService.getTrials().subscribe({
      next: (trials) => {
        this._totalTrials.set(trials.length);
        for (let i = 0; i <= this.position(); i++) {
          let trialsList: Trial[] = [];
          for (let j = 0; j < 8; j++) {
            if(trials[8 * i + j] !== undefined && i <= this.position()) {
              trialsList.push(trials[8 * i + j]);
            }
          }
          this._trials.set(trialsList);
        }// Trigger ngOnChanges to repaint the HTML
        this.ngOnChanges({});
      },
      error: (message) => {
        this.loading = false;
        this.firstLoading = false;
      },
      complete: () => {
        this.loading = false;
        this.firstLoading = false;
      },
    });
  }

  removeTrial(id: string | null): void {
    this.loading = true;
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.frutyfestService
          .getTrial(id!)
          .pipe(
            switchMap(() => this.frutyfestService.removeTrial(id!)),
            tap(() => this.getTrials(this.position()))
          )
          .subscribe({
            error: (message) => {
              this.loading = false;
            },
            complete: () => {
              this.loading = false;
            },
          });
      } else {
        this.loading = false;
      }
    });
  }
}
