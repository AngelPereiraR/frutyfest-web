import {
  ChangeDetectorRef,
  Component,
  SimpleChanges,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FrutyfestService } from '../../services/frutyfest.service';
import { Team } from '../../interfaces/team.interface';

@Component({
  selector: 'frutyfest-02-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss'],
})
export class RankingComponent {
  private frutyfestService = inject(FrutyfestService);
  private _teams = signal<Team[] | undefined>(undefined);
  public teams = computed(() => this._teams());
  private participants: Team[] = [];
  public loading: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {
    this.getTeams();
  }

  ngOnInit(): void {
    this.frutyfestService.setPage('frutyfest02');
  }

  ngOnDestroy(): void {
    this.frutyfestService.setPage('');
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Trigger a change detection cycle to repaint the HTML
    this.cdr.detectChanges();
  }

  getTeams(): void {
    this.loading = true;
    this.frutyfestService.getTeams().subscribe({
      next: (teams) => {
        const teamsFF3 = teams.filter((team) => team.event === 'FrutyFest 2');
        teamsFF3.sort((a, b) => b.totalPoints - a.totalPoints);
        for (let i = 0; i < teamsFF3.length; i++) {
          if (
            !teamsFF3[i].roles.includes('winner') &&
            !teamsFF3[i].roles.includes('eliminated in phase 5') &&
            !teamsFF3[i].roles.includes('eliminated in phase 4') &&
            !teamsFF3[i].roles.includes('eliminated in phase 3') &&
            !teamsFF3[i].roles.includes('eliminated in phase 2') &&
            !teamsFF3[i].roles.includes('eliminated in phase 1')
          ) {
            this.participants.push(teamsFF3[i]);
          }
        }
        this.getTeamsByRole('winner', teamsFF3);
        this.getTeamsByRole('eliminated in phase 5', teamsFF3);
        this.getTeamsByRole('eliminated in phase 4', teamsFF3);
        this.getTeamsByRole('eliminated in phase 3', teamsFF3);
        this.getTeamsByRole('eliminated in phase 2', teamsFF3);
        this.getTeamsByRole('eliminated in phase 1', teamsFF3);
        this._teams.set(this.participants);
        // Trigger ngOnChanges to repaint the HTML
        this.ngOnChanges({});
      },
      error: (message) => {
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  private getTeamsByRole(role: string, teams: Team[]) {
    for (let i = 0; i < teams.length; i++) {
      if (teams[i].roles.includes(role) && teams[i].event === 'FrutyFest 2') {
        this.participants.push(teams[i]);
      }
    }
  }
}
