import { ChangeDetectorRef, Component, SimpleChanges, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/auth/interfaces';
import { AuthService } from 'src/app/auth/services/auth.service';
import { FrutyfestService } from 'src/app/frutyfest/services/frutyfest.service';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './team-add.component.html',
  styleUrls: ['./team-add.component.css']
})
export class TeamAddComponent {
  private frutyfestService = inject(FrutyfestService);
  private authService = inject(AuthService);
  private _users = signal<User[] | undefined>(undefined);
  public users = computed(() => this._users());
  private fb = inject(FormBuilder);
  private router = inject(Router);

  public myForm: FormGroup = this.fb.group({
    color: ['#000000', [Validators.required, Validators.minLength(7), Validators.maxLength(7)]],
    participants: [[], [Validators.required]],
  });

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
        let participants: User[] = [];
        for (let i = 0; i < users.length; i++) {
          if (users[i].roles.includes('participant') && !users[i].roles.includes('onTeam')) {
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

  addTeam(): void {
    const { color, participants } = this.myForm.value;

    for (let i = 0; i < participants.length; i++) {
      this.authService.setSelectedOnTeam(participants[i]._id).subscribe();
    }

    this.frutyfestService.addTeam(color, participants, 0)
      .subscribe({
        next: (team) => {
          Swal.fire('Creación', 'Creación del equipo correcta', 'success')
          this.router.navigateByUrl('/admin/team');
        },
        error: (message) => {
          Swal.fire('Error', message, 'error');
        }
      });
  }
}
