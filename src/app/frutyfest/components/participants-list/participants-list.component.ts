import { ChangeDetectorRef, Component, SimpleChanges, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/auth/interfaces';
import { AuthService } from 'src/app/auth/services/auth.service';
import { FrutyfestService } from '../../services/frutyfest.service';

@Component({
  selector: 'frutyfest-participants',
  templateUrl: './participants-list.component.html',
  styleUrls: ['./participants-list.component.scss']
})
export class ParticipantsListComponent {
  private frutyfestService = inject(FrutyfestService);
  private authService = inject(AuthService);
  private _users = signal<User[] | undefined>(undefined);
  public users = computed(() => this._users());

  constructor(private cdr: ChangeDetectorRef) {
    this.getUsers();
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

  getUsers(): void {
    this.authService.getUsers().subscribe({
      next: (users) => {
        let participants: User[] = [];
        for (let i = 0; i < users.length; i++) {
          if (users[i].roles.includes('participant')) {
            participants.push(users[i]);
          }
        }
        this._users.set(participants);
        // Trigger ngOnChanges to repaint the HTML
        this.ngOnChanges({});
      },
      error: (message) => {
      }
    });
  }
}
