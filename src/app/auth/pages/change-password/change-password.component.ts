import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidatorsService } from 'src/app/shared/service/validators.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces';

@Component({
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private validatorsService = inject(ValidatorsService);
  public loading: boolean = false;
  public user!: User;

  public myForm: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  }, {
    validators: [
      this.validatorsService.isFieldOneEqualFieldTwo('password', 'confirmPassword')
    ]
  });

   constructor(private route: ActivatedRoute) {
    this.route.paramMap.subscribe((params) => {
      this.getUser(params.get('id')!);
    });
  }

  getUser(id: string): void {
    this.loading = true;
    this.authService.getUser(id).subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (message) => {
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  showPassword = false;

  changePassword() {
    this.loading = true;
    let { password } = this.myForm.value;

    this.authService.getUserByEmail(this.user?.email!)
      .subscribe({
        next: (user) => {
          this.authService.changePassword(user._id, this.user?.email!, password, user.name, user.minecraftName, user.hasCompanion, user.presentation, user.companionName, user.event).subscribe({
            next: () => {
              Swal.fire('Cambio de contraseña', 'Se le ha enviado un correo confirmando la realización del cambio de contraseña. Si no aparece en Recibidos, por favor mire en su carpeta de Spam, gracias.', 'success')
              this.router.navigateByUrl('/');
            },
            error: (message) => {
              Swal.fire('Error', message, 'error');
            }
          })
        },
        error: (message) => {
          Swal.fire('Error', message, 'error');
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });


  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
