import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorsService } from 'src/app/shared/service/validators.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private validatorsService = inject(ValidatorsService);

  public myForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(this.validatorsService.emailPattern)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  }, {
    validators: [
      this.validatorsService.isFieldOneEqualFieldTwo('password', 'confirmPassword')
    ]
  });

  showPassword = false;

  changePassword() {
    let { email, password } = this.myForm.value;

    this.authService.getUserByEmail(email)
      .subscribe({
        next: (user) => {
          this.authService.changePassword(user._id, email, password, user.name, user.minecraftName, user.hasCompanion, user.presentation, user.companionName, user.event).subscribe({
            next: () => {
              Swal.fire('Cambio de contraseña', 'Cambio de contraseña correcto. Se le ha enviado un correo con las nuevas credenciales para el inicio de sesión. Si no aparece en Recibidos, por favor mire en su carpeta de Spam, gracias.', 'success')
              this.router.navigateByUrl('/');
            },
            error: (message) => {
              Swal.fire('Error', message, 'error');
            }
          })
        },
        error: (message) => {
          Swal.fire('Error', message, 'error');
        }
      });


  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
