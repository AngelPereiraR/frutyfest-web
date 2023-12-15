import { ChangeDetectorRef, Component, SimpleChanges, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Team } from 'src/app/frutyfest/interfaces/team.interface';
import { FrutyfestService } from 'src/app/frutyfest/services/frutyfest.service';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './temporalteam-add.component.html',
  styleUrls: ['./temporalteam-add.component.css']
})
export class TemporalteamAddComponent {
  private frutyfestService = inject(FrutyfestService);
  private _teams = signal<Team[] | undefined>(undefined);
  public teams = computed(() => this._teams());
  private fb = inject(FormBuilder);
  private router = inject(Router);

  public myForm: FormGroup = this.fb.group({
    color: ['#000000', [Validators.required, Validators.minLength(7), Validators.maxLength(7)]],
    teams: [[], [Validators.required]],
  });

  constructor(private cdr: ChangeDetectorRef) {
    this.getTeams();
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

  getTeams(): void {
    this.frutyfestService.getTeams().subscribe({
      next: (teams) => {
        let teamsSelected: Team[] = [];
        for (let i = 0; i < teams.length; i++) {
          teamsSelected.push(teams[i]);
        }
        this._teams.set(teamsSelected);
        // Trigger ngOnChanges to repaint the HTML
        this.ngOnChanges({});
      },
      error: (message) => {
      }
    });
  }

  addTemporal(): void {
    const { color, teams } = this.myForm.value;

    for (let i = 0; i < teams.length; i++) {
      this.frutyfestService.setSelectedOnTemporal(teams[i]).subscribe();
    }

    this.frutyfestService.addTemporal(color, teams)
      .subscribe({
        next: (temporal) => {
          Swal.fire('Creación', 'Creación del equipo temporal correcta', 'success')
          this.router.navigateByUrl('/admin/temporal');
        },
        error: (message) => {
          Swal.fire('Error', message, 'error');
        }
      });
  }
}
