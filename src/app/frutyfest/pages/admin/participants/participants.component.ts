import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, computed, inject, signal, ChangeDetectorRef } from '@angular/core';
import { User } from 'src/app/auth/interfaces';
import { AuthService } from 'src/app/auth/services/auth.service';
import { FrutyfestService } from 'src/app/frutyfest/services/frutyfest.service';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss']
})
export class ParticipantsComponent implements OnInit, OnDestroy, OnChanges {

  private frutyfestService = inject(FrutyfestService);
  private authService = inject(AuthService);
  private _users = signal<User[] | undefined>(undefined);
  public users = computed(() => this._users());

  constructor(private cdr: ChangeDetectorRef) {
    this.getUsers();
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

  getUsers(): void {
    this.authService.getUsers().subscribe({
      next: (users) => {
        for (let i = 0; i < users.length; i++) {
          if (users[i].roles.includes('admin')) {
            users.splice(i, 1);
          }
        }
        this._users.set(users);
        // Trigger ngOnChanges to repaint the HTML
        this.ngOnChanges({});
      },
      error: (message) => {
      }
    });
  }

  setParticipant(id: string | null): void {
    this.authService.setParticipant(id!).subscribe();
    this.getUsers();
  }

  removeParticipant(id: string | null): void {
    this.authService.removeParticipant(id!).subscribe();
    this.getUsers();
  }

  removeUser(id: string | null): void {
    this.authService.removeUser(id!).subscribe();
    this.getUsers();
  }

}
