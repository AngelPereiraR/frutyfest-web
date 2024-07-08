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
  private _position = signal<number>(0);
  public position = computed(() => this._position());
  private _totalUsers = signal<number>(0);
  public totalUsers = computed(() => this._totalUsers());
  public totalPages: number = 0;
  public loading: boolean = false;
  public firstLoading: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {
    this.firstLoading = true;
    this.getUsers(this.position());
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
    this.totalPages = Math.ceil(this.totalUsers() / 8);
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  async getUsers(position: number): Promise<void> {
    this.loading = true;
    if (position <= this.totalPages - 1 && position >= 0) {
      this._position.set(position);
    }
    this.authService.getUsers().subscribe({
      next: (users) => {
        const notAdminUsers = users.filter(
          (user) =>
            !user.roles.includes('admin') && user.event === 'FrutyFest 3'
        );
        this._totalUsers.set(notAdminUsers.length);
        for (let i = 0; i <= this.position(); i++) {
          let usersList: User[] = [];
          for (let j = 0; j < 8; j++) {
            if (
              notAdminUsers[8 * i + j] !== undefined &&
              i <= this.position()
            ) {
              usersList.push(notAdminUsers[8 * i + j]);
            }
          }
          this._users.set(usersList);
        }
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
        this.getUsers(this.position());
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
        this.getUsers(this.position());
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
        this.getUsers(this.position());
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
        this.getUsers(this.position());
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
            this.getUsers(this.position());
            this.ngOnChanges({});
          },
        });
      } else {
        this.loading = false;
      }
    });
  }
}
