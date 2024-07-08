import {
  ChangeDetectorRef,
  Component,
  SimpleChanges,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Team } from 'src/app/frutyfest/interfaces/team.interface';
import { FrutyfestService } from 'src/app/frutyfest/services/frutyfest.service';
import { AuthService } from '../../../../../auth/services/auth.service';
import { switchMap, forkJoin, tap } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './team-table.component.html',
  styleUrls: ['./team-table.component.scss'],
})
export class TeamTableComponent {
  private frutyfestService = inject(FrutyfestService);
  private authService = inject(AuthService);
  private _teams = signal<Team[] | undefined>(undefined);
  public teams = computed(() => this._teams());
  private _position = signal<number>(0);
  public position = computed(() => this._position());
  private _totalTeams = signal<number>(0);
  public totalTeams = computed(() => this._totalTeams());
  public totalPages: number = 0;
  public loading: boolean = false;
  public firstLoading: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {
    this.firstLoading = true;
    this.getTeams(this.position());
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
    this.totalPages = Math.ceil(this.totalTeams() / 8);
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  getTeams(position: number): void {
    this.loading = true;
    if (position <= this.totalPages - 1 && position >= 0) {
      this._position.set(position);
    }
    this.frutyfestService.getTeams().subscribe({
      next: (teams) => {
        const teamsFF3 = teams.filter((teams) => teams.event === 'FrutyFest 3');
        this._totalTeams.set(teamsFF3.length);
        for (let i = 0; i <= this.position(); i++) {
          let teamsList: Team[] = [];
          for (let j = 0; j < 8; j++) {
            if (teamsFF3[8 * i + j] !== undefined && i <= this.position()) {
              teamsList.push(teamsFF3[8 * i + j]);
            }
          }
          this._teams.set(teamsList);
        }
        // Trigger ngOnChanges to repaint the HTML
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

  removeTeam(id: string | null): void {
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
          .getTeam(id!)
          .pipe(
            switchMap((team) => {
              // Trigger ngOnChanges to repaint the HTML
              this.ngOnChanges({});
              return forkJoin(
                team.users.map((user) =>
                  this.authService.removeSelectedOnTeam(user._id)
                )
              );
            }),
            switchMap(() => this.frutyfestService.removeTeam(id!)),
            tap(() => this.getTeams(this.position()))
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

  getTeammate(id: string) {
    this.loading = true;
    this.authService.getUser(id).subscribe({
      next: (user) => {
        return user.name;
      },
      error: (message) => {
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
