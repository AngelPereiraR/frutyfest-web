import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/auth/interfaces';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Event } from 'src/app/frutyfest/interfaces/team.interface';
import { FrutyfestService } from 'src/app/frutyfest/services/frutyfest.service';
import { ValidatorsService } from 'src/app/shared/service/validators.service';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent {
  private fb = inject(FormBuilder);
  private frutyfestService = inject(FrutyfestService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private validatorsService = inject(ValidatorsService);
  public user: User | undefined;
  public loading: boolean = false;
  public firstLoading: boolean = false;

  public events: Event[] = [];

  public myForm: FormGroup = this.fb.group({
    _id: ['', [Validators.required]],
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(this.validatorsService.emailPattern),
      ],
    ],
    name: ['', [Validators.required]],
    minecraftName: ['', [Validators.required]],
    hasCompanion: [false, [Validators.required]],
    companionName: [''],
    event: ['', [Validators.required]],
    presentation: ['', [Validators.required]],
  });

  constructor(private route: ActivatedRoute) {
    this.route.paramMap.subscribe((params) => {
      this.getUser(params.get('id'));
    });
    this.events = [
      {
        event: 'FrutyFest 2',
      },
    ];
  }

  ngOnInit(): void {
    this.frutyfestService.setPage('participant');
  }

  ngOnDestroy(): void {
    this.frutyfestService.setPage('');
  }

  getUser(id: string | null): void {
    this.firstLoading = true;
    this.authService.getUser(id!).subscribe({
      next: (user) => {
        this.user = user;

        this.myForm.patchValue({
          _id: user._id,
          email: user.email,
          name: user.name,
          minecraftName: user.minecraftName,
          hasCompanion: user.hasCompanion,
          companionName: user.companionName,
          event: user.event,
          presentation: user.presentation,
        });
      },
      error: (message) => {
        this.firstLoading = false;
      },
      complete: () => {
        this.firstLoading = false;
      },
    });
  }

  changeUser() {
    this.loading = true;
    let {
      _id,
      email,
      name,
      minecraftName,
      hasCompanion,
      companionName,
      presentation,
      event,
    } = this.myForm!.value;

    if (!companionName) companionName = 'No tiene';

    if (hasCompanion === 'true') {
      hasCompanion = true;
    } else if (hasCompanion === 'false') {
      hasCompanion = false;
    }

    this.authService
      .changeUser(
        _id,
        email,
        name,
        minecraftName,
        hasCompanion,
        presentation,
        companionName,
        event
      )
      .subscribe({
        next: () => {
          Swal.fire('Cambiar perfil', 'Cambio de perfil correcto.', 'success');
          this.router.navigateByUrl(`/participant/${_id}`);
        },
        error: (message) => {
          Swal.fire('Error', message, 'error');
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        },
      });
  }
}
