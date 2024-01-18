import {
  ChangeDetectorRef,
  Component,
  SimpleChanges,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/auth/interfaces';
import { Event } from 'src/app/frutyfest/interfaces/team.interface';
import { AuthService } from 'src/app/auth/services/auth.service';
import { FrutyfestService } from 'src/app/frutyfest/services/frutyfest.service';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './team-add.component.html',
  styleUrls: ['./team-add.component.css'],
})
export class TeamAddComponent {
  private frutyfestService = inject(FrutyfestService);
  private authService = inject(AuthService);
  private _users = signal<User[] | undefined>(undefined);
  public users = computed(() => this._users());
  private fb = inject(FormBuilder);
  private router = inject(Router);
  public loading: boolean = false;
  public firstLoading: boolean = false;

  public events: Event[] = [];

  public myForm: FormGroup = this.fb.group({
    color: [
      '#000000',
      [Validators.required, Validators.minLength(7), Validators.maxLength(7)],
    ],
    participants: [[], [Validators.required]],
    event: ['', [Validators.required]],
  });

  constructor(private cdr: ChangeDetectorRef) {
    this.firstLoading = true;
    this.getUsers();
    this.events = [
      {
        event: 'FrutyFest 2',
      },
    ];
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
    this.loading = true;
    this.authService.getUsers().subscribe({
      next: (users) => {
        let participants: User[] = [];
        for (let i = 0; i < users.length; i++) {
          if (
            users[i].roles.includes('participant') &&
            !users[i].roles.includes('onTeam')
          ) {
            participants.push(users[i]);
          }
        }
        this._users.set(participants);
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

  addTeam(): void {
    this.loading = true;
    const { color, participants, event } = this.myForm.value;

    let name = '';

    for (let i = 0; i < participants.length; i++) {
      this.authService.setSelectedOnTeam(participants[i]._id).subscribe();
      if (i < participants.length - 1) {
        let participantNameReduced: string = participants[i].name;
        name += participantNameReduced.slice(0, 3);
        name += '-';
      } else {
        let participantNameReduced: string = participants[i].name;
        name += participantNameReduced.slice(0, 3);
      }
    }

    this.frutyfestService
      .addTeam(color, participants, event, 0, name, [])
      .subscribe({
        next: (team) => {
          Swal.fire('Creación', 'Creación del equipo correcta', 'success');
          this.router.navigateByUrl('/admin/team');
        },
        error: (message) => {
          Swal.fire('Error', message.toString(), 'error');
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        },
      });
  }
}
