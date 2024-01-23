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
  private _position = signal<number>(0);
  public position = computed(() => this._position());
  private _totalUsers = signal<number>(0);
  public totalUsers = computed(() => this._totalUsers());
  public totalPages: number = 0;
  public loading: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {
    this.getUsers(this.position());
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

  getPageNumbers(): number[] {
    this.totalPages = Math.ceil(this.totalUsers() / 8);
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  getUsers(position: number): void {
    this.loading = true;
    if(position <= this.totalPages - 1 && position >= 0) {
      this._position.set(position);
    }
    this.authService.getUsers().subscribe({
      next: (users) => {
        let participants: User[] = [];
        for (let i = 0; i < users.length; i++) {
          if (users[i].roles.includes('participant')) {
            participants.push(users[i]);
          }
        }
        this._totalUsers.set(participants.length);
        for (let i = 0; i <= this.position(); i++) {
          let usersList: User[] = [];
          for (let j = 0; j < 8; j++) {
            if(participants[8 * i + j] !== undefined && i <= this.position()) {
              usersList.push(participants[8 * i + j]);
            }
          }
          this._users.set(usersList);
        }
        // Trigger ngOnChanges to repaint the HTML
        this.ngOnChanges({});
      },
      error: (message) => {
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
