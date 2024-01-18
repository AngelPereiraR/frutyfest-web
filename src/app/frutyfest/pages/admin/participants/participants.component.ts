import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  computed,
  inject,
  signal,
  ChangeDetectorRef,
} from '@angular/core';
import { User } from 'src/app/auth/interfaces';
import { AuthService } from 'src/app/auth/services/auth.service';
import { FrutyfestService } from 'src/app/frutyfest/services/frutyfest.service';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss'],
})
export class ParticipantsComponent implements OnInit, OnDestroy, OnChanges {
  private frutyfestService = inject(FrutyfestService);
  private authService = inject(AuthService);
  private _users = signal<User[] | undefined>(undefined);
  public users = computed(() => this._users());
  public loading: boolean = false;
  public firstLoading: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {
    this.firstLoading = true;
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

  async getUsers(): Promise<void> {
    this.loading = true;
    this.authService.getUsers().subscribe({
      next: (users) => {
        for (let i = 0; i < users.length; i++) {
          if (users[i].roles.includes('admin')) {
            users.splice(i, 1);
          }
        }
        this._users.set(users);
      },
      error: (message) => {
        this.loading = false;
        this.firstLoading = false;
      },
      complete: () => {
        this.loading = false;
        this.firstLoading = false;
        // Trigger ngOnChanges to repaint the HTML
        this.ngOnChanges({});
      },
    });
  }

  setParticipant(id: string | null): void {
    this.loading = true;
    this.authService.setParticipant(id!).subscribe({
      error: (message) => {
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
        this.getUsers();
        this.ngOnChanges({});
      },
    });
  }

  removeParticipant(id: string | null): void {
    this.loading = true;
    this.authService.removeParticipant(id!).subscribe({
      error: (message) => {
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
        this.getUsers();
        this.ngOnChanges({});
      },
    });
  }

  setAlternate(id: string | null): void {
    this.loading = true;
    this.authService.setAlternate(id!).subscribe({
      error: (message) => {
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
        this.getUsers();
        this.ngOnChanges({});
      },
    });
  }

  removeAlternate(id: string | null): void {
    this.loading = true;
    this.authService.removeAlternate(id!).subscribe({
      error: (message) => {
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
        this.getUsers();
        this.ngOnChanges({});
      },
    });
  }

  removeUser(id: string | null): void {
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
        this.authService.removeUser(id!).subscribe({
          error: (message) => {
            this.loading = false;
          },
          complete: () => {
            this.loading = false;
            this.getUsers();
            this.ngOnChanges({});
          },
        });
      } else {
        this.loading = false;
      }
    });
  }
}
