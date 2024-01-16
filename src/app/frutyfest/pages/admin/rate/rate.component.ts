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
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/auth/interfaces';
import { Event, Team } from 'src/app/frutyfest/interfaces/team.interface';
import { AuthService } from 'src/app/auth/services/auth.service';
import { FrutyfestService } from 'src/app/frutyfest/services/frutyfest.service';
import Swal from 'sweetalert2';
import { Trial } from 'src/app/frutyfest/interfaces/trial.interface';

@Component({
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.css'],
})
export class RateComponent {
  private frutyfestService = inject(FrutyfestService);
  private authService = inject(AuthService);
  private _trials = signal<Trial[] | undefined>(undefined);
  public trials = computed(() => this._trials());
  private _trial = signal<Trial | undefined>(undefined);
  public trial = computed(() => this._trial());
  private _teams = signal<Team[] | undefined>(undefined);
  public teams = computed(() => this._teams());
  private fb = inject(FormBuilder);
  private router = inject(Router);

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

  //TODO 2: Si no hay rol "Eliminado en fase **" en ningún equipo no mostrar los modos de juego de fases posteriores
  getGamemodes(): void {
    this.frutyfestService.getTrials().subscribe({
      next: (gamemodes) => {
        this._trials.set(gamemodes);
        // Trigger ngOnChanges to repaint the HTML
        this.ngOnChanges({});
      },
      error: (message) => {},
    });
  }

  activateGamemode(): void {
    const { gamemode } = this.myForm.value;

    this.frutyfestService.getTrial(gamemode).subscribe({
      next: (gamemode) => {
        this._trial.set(gamemode);
        this.secondFormEnabled = true;

        const maxTeams = this.trial()?.maxTeams;

        for (let i = 1; i <= maxTeams!; i++) {
          this.teamsNumber.push(i);
          const controlName = `equipo${i}`;
          this.equiposSeleccionados[controlName] = [
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

        this.frutyfestService.getTeams().subscribe({
          next: (teams) => {
            this._teams.set(teams);

            this.ngOnChanges({});
          },
          error: (message) => {
            Swal.fire('Error', message, 'error');
          },
        });
      },
      error: (message) => {
        Swal.fire('Error', message, 'error');
      },
    });
  }

  //TODO 3: Quitar los console.log
  //TODO 2: Si es final de fase, evaluar los puntos de todos los equipos y asignar rol "Eliminado en fase **" a los eliminados
  async rateGamemode() {
    const { equiposSeleccionados } = this.myForm2.value;
    console.log(equiposSeleccionados);
    let teams: Team[] = [];
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
            console.log(teams, 'array');
          }
          arrayCompleted = true;
        } else if (typeof valor === 'number' && arrayCompleted) {
          console.log(teams, 'number');
          let gamemodePoints = this.trial()!.maxPoints;
          let decrease = this.trial()!.pointsDecrease;
          for (let i = 1; i < valor; i++) {
            gamemodePoints = gamemodePoints - decrease;
          }
          for (let i = 0; i < teams.length; i++) {
            teams[i].totalPoints = teams[i].totalPoints + gamemodePoints!;
            console.log(teams[i]);
            this.frutyfestService.updateTeam(
              teams[i]._id,
              teams[i].color,
              teams[i].users,
              teams[i].event,
              teams[i].totalPoints,
              teams[i].name
            ).subscribe({
              next: () => {
              },
              error: (message) => {
                Swal.fire('Error', message, 'error');
              }
            });
          }
        }
      }
    }
    Swal.fire('Puntuaciones', 'Puntuaciones realizadas correctamente.', 'success')
    this.router.navigateByUrl('/admin/team');
  }
}
