import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorsService } from 'src/app/shared/service/validators.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css']
})
export class RecoverPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private validatorsService = inject(ValidatorsService);
  public loading: boolean = false;

  public myForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(this.validatorsService.emailPattern)]],
  });

  showPassword = false;

  changePassword() {
    this.loading = true;
    let { email } = this.myForm.value;

    this.authService.getUserByEmail(email)
      .subscribe({
        next: (user) => {
          this.authService.recoverPassword(user._id).subscribe({
            next: () => {
              Swal.fire('Correo enviado', 'Se le ha enviado un correo para cambiar la contraseña. Si no aparece en Recibidos, por favor mire en su carpeta de Spam, gracias.', 'success')
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
