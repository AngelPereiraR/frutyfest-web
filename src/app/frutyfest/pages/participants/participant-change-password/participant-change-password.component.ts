import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/auth/interfaces';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ValidatorsService } from 'src/app/shared/service/validators.service';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './participant-change-password.component.html',
  styleUrls: ['./participant-change-password.component.css'],
})
export class ParticipantChangePasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private validatorsService = inject(ValidatorsService);
  public user: User | undefined;
  public loading: boolean = false;
  public firstLoading: boolean = false;

  public myForm: FormGroup = this.fb.group(
    {
      _id: ['', [Validators.required]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(this.validatorsService.emailPattern),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: [
        this.validatorsService.isFieldOneEqualFieldTwo(
          'password',
          'confirmPassword'
        ),
      ],
    }
  );

  constructor(private route: ActivatedRoute) {
    this.route.paramMap.subscribe((params) => {
      this.getUser(params.get('id'));
    });
  }

  getUser(id: string | null): void {
    this.firstLoading = true;
    this.authService.getUser(id!).subscribe({
      next: (user) => {
        this.user = user;

        this.myForm.patchValue({
          _id: user._id,
          email: user.email,
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

  showPassword = false;

  changePassword() {
    this.loading = true;
    let { email, password } = this.myForm.value;

    this.authService.getUserByEmail(email).subscribe({
      next: (user) => {
        this.authService
          .changePassword(
            user._id,
            email,
            password,
            user.name,
            user.minecraftName,
            user.hasCompanion,
            user.presentation,
            user.companionName,
            user.event
          )
          .subscribe({
            next: () => {
              Swal.fire(
                'Cambio de contraseña',
                'Cambio de contraseña correcto. Se le ha enviado un correo con las nuevas credenciales para el inicio de sesión. Si no aparece en Recibidos, por favor mire en su carpeta de Spam, gracias.',
                'success'
              );
              this.router.navigateByUrl(`/participant/${user._id}`);
            },
            error: (message) => {
              Swal.fire('Error', message, 'error');
            },
          });
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

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
