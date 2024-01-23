import {
  ChangeDetectorRef,
  Component,
  SimpleChanges,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Team } from 'src/app/frutyfest/interfaces/team.interface';
import { FrutyfestService } from 'src/app/frutyfest/services/frutyfest.service';
import Swal from 'sweetalert2';
import { Trial } from 'src/app/frutyfest/interfaces/trial.interface';
import { concatMap } from 'rxjs';

@Component({
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.css'],
})
export class RateComponent {
  private frutyfestService = inject(FrutyfestService);
  private _trials = signal<Trial[] | undefined>(undefined);
  public trials = computed(() => this._trials());
  private _trial = signal<Trial | undefined>(undefined);
  public trial = computed(() => this._trial());
  private _teams = signal<Team[] | undefined>(undefined);
  public teams = computed(() => this._teams());
  private fb = inject(FormBuilder);
  private router = inject(Router);
  public loading: boolean = false;
  public firstLoading: boolean = false;

  private _phase = signal<number>(1);
  public phase = computed(() => this._phase());

  secondFormEnabled: boolean = false;

  public myForm: FormGroup = this.fb.group({
    gamemode: ['Seleccione un modo de juego', [Validators.required]],
  });

  equiposSeleccionados: { [key: string]: any } = {};
  public teamsNumber: number[] = [];

  public myForm2: FormGroup = this.fb.group({
    equiposSeleccionados: this.fb.group(this.equiposSeleccionados),
    position: this.fb.group(this.teamsNumber),
  });

  constructor(private cdr: ChangeDetectorRef) {
    this.firstLoading = true;
    this.getGamemodes();
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

  async getGamemodes(): Promise<void> {
    this.frutyfestService
      .getTeams()
      .pipe(
        concatMap((teams) => {
          for (let i = 0; i < teams.length; i++) {
            if (teams[i].roles.includes('eliminated in phase 1')) {
              this._phase.set(Math.max(this.phase(), 2));
            } else if (teams[i].roles.includes('eliminated in phase 2')) {
              this._phase.set(Math.max(this.phase(), 3));
            } else if (teams[i].roles.includes('eliminated in phase 3')) {
              this._phase.set(Math.max(this.phase(), 4));
            } else if (teams[i].roles.includes('eliminated in phase 4')) {
              this._phase.set(Math.max(this.phase(), 5));
            }
          }

          // Return an observable to continue the chain
          return this.frutyfestService.getTrials();
        })
      )
      .subscribe({
        next: (gamemodes) => {
          let gamemodesArray: Trial[] = [];

          for (let i = 0; i < gamemodes.length; i++) {
            if (
              gamemodes[i].rated !== true &&
              gamemodes[i].phase === this.phase()
            ) {
              gamemodesArray.push(gamemodes[i]);
            }
          }

          this._trials.set(gamemodesArray);
          // Trigger ngOnChanges to repaint the HTML
          this.ngOnChanges({});
        },
        error: (message) => {
          this.firstLoading = false;
        },
        complete: () => {
          this.firstLoading = false;
        },
      });
  }

  activateGamemode(): void {
    this.loading = true;
    const { gamemode } = this.myForm.value;

    this.frutyfestService.getTrial(gamemode).subscribe({
      next: (gamemode) => {
        this._trial.set(gamemode);
        this.secondFormEnabled = true;

        const maxTeams = this.trial()?.maxTeams;

        for (let i = 1; i <= maxTeams!; i++) {
          this.teamsNumber.push(i);
          const teamName = `equipo${i}`;
          this.equiposSeleccionados[teamName] = [
            '',
            [Validators.required, Validators.min(0)],
          ];
          const positionName = `position${i}`;
          this.equiposSeleccionados[positionName] = [
            0,
            [Validators.required, Validators.min(0), Validators.max(maxTeams!)],
          ];
        }

        this.myForm2 = this.fb.group({
          equiposSeleccionados: this.fb.group(this.equiposSeleccionados),
        });

        this.ngOnChanges({});

        this.getTeams();
      },
      error: (message) => {
        Swal.fire('Error', message, 'error');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  async rateGamemode() {
    this.loading = true;
    const { equiposSeleccionados } = this.myForm2.value;
    let teams: Team[] = [];
    let allTeams: Team[] = [];
    let arrayCompleted = false;

    for (let propiedad in equiposSeleccionados) {
      if (equiposSeleccionados.hasOwnProperty(propiedad)) {
        const valor = equiposSeleccionados[propiedad];
        if (Array.isArray(valor)) {
          teams = [];
          for (let i = 0; i < valor.length; i++) {
            const team = await this.frutyfestService
              .getTeam(valor[i])
              .toPromise();
            teams.push(team!);
          }
          arrayCompleted = true;
        } else if (typeof valor === 'number' && arrayCompleted) {
          let gamemodePoints = this.trial()!.maxPoints;
          let decrease = this.trial()!.pointsDecrease;
          for (let i = 1; i < valor; i++) {
            gamemodePoints = gamemodePoints - decrease;
          }
          for (let i = 0; i < teams.length; i++) {
            if (this.trial()?.beginningPhase === true) {
              teams[i].totalPoints = gamemodePoints!;
            } else {
              teams[i].totalPoints = teams[i].totalPoints + gamemodePoints!;
            }
            await this.updateTeam(teams[i]);
            allTeams.push(teams[i]);
          }
        }
      }
    }
    this.updateTrial();
    if (this.trial()?.endingPhase === true) {
      allTeams.sort((a: Team, b: Team) => a.totalPoints - b.totalPoints);
      if (this.phase() === 1) {
        for (let i = 0; i < 6; i++) {
          this.frutyfestService.setEliminatedPhase1(allTeams[i]._id).subscribe({
            next: () => {},
            error: (message) => {
              Swal.fire('Error', message, 'error');
              this.loading = false;
            },
            complete: () => {
              this.loading = false;
            },
          });
        }
      } else if (this.phase() === 2) {
        for (let i = 0; i < 2; i++) {
          this.frutyfestService.setEliminatedPhase2(allTeams[i]._id).subscribe({
            next: () => {},
            error: (message) => {
              Swal.fire('Error', message, 'error');
              this.loading = false;
            },
            complete: () => {
              this.loading = false;
            },
          });
        }
      } else if (this.phase() === 3) {
        for (let i = 0; i < 2; i++) {
          this.frutyfestService.setEliminatedPhase3(allTeams[i]._id).subscribe({
            next: () => {},
            error: (message) => {
              Swal.fire('Error', message, 'error');
              this.loading = false;
            },
            complete: () => {
              this.loading = false;
            },
          });
        }
      } else if (this.phase() === 4) {
        this.frutyfestService.setEliminatedPhase4(allTeams[0]._id).subscribe({
          next: () => {},
          error: (message) => {
            Swal.fire('Error', message, 'error');
            this.loading = false;
          },
          complete: () => {
            this.loading = false;
          },
        });
      } else if (this.phase() === 5) {
        this.frutyfestService.setEliminatedPhase5(allTeams[0]._id).subscribe({
          next: () => {},
          error: (message) => {
            Swal.fire('Error', message, 'error');
            this.loading = false;
          },
          complete: () => {
            this.loading = false;
          },
        });
        this.frutyfestService.setWinner(allTeams[1]._id).subscribe({
          next: () => {},
          error: (message) => {
            Swal.fire('Error', message, 'error');
            this.loading = false;
          },
          complete: () => {
            this.loading = false;
          },
        });
      }
    }

    Swal.fire(
      'Puntuaciones',
      'Puntuaciones realizadas correctamente.',
      'success'
    );
    this.router.navigateByUrl('/admin');
  }

  private async getTeams() {
    this.firstLoading = true;
    this.frutyfestService.getTeams().subscribe({
      next: (teams) => {
        let teamsArray: Team[] = [];
        for (let i = 0; i < teams.length; i++) {
          if (
            !teams[i].roles.includes('eliminated in phase 1') &&
            !teams[i].roles.includes('eliminated in phase 2') &&
            !teams[i].roles.includes('eliminated in phase 3') &&
            !teams[i].roles.includes('eliminated in phase 4') &&
            !teams[i].roles.includes('eliminated in phase 5')
          ) {
            teamsArray.push(teams[i]);
          }
        }

        this._teams.set(teamsArray);

        this.ngOnChanges({});
      },
      error: (message) => {
        Swal.fire('Error', message, 'error');
        this.firstLoading = false;
      },
      complete: () => {
        this.firstLoading = false;
      },
    });
  }

  private async updateTrial() {
    this.loading = true;
    this.frutyfestService
      .updateTrial(
        this.trial()!._id,
        this.trial()!.name,
        this.trial()!.maxPoints,
        this.trial()!.pointsDecrease,
        this.trial()!.maxTeams,
        this.trial()!.phase,
        !this.trial()!.rated,
        this.trial()!.beginningPhase,
        this.trial()!.endingPhase
      )
      .subscribe({
        next: () => {},
        error: (message) => {
          Swal.fire('Error', message, 'error');
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  private async updateTeam(team: Team) {
    this.loading = true;
    this.frutyfestService
      .updateTeam(
        team._id,
        team.color,
        team.users,
        team.event,
        team.totalPoints,
        team.name,
        team.roles
      )
      .subscribe({
        next: () => {},
        error: (message) => {
          Swal.fire('Error', message, 'error');
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        },
      });
  }
}
