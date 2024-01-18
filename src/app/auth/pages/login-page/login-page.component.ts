import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { AuthService } from '../../services/auth.service';

@Component({
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  public loading: boolean = false;

  public myForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  showPassword = false;

  login() {
    this.loading = true;
    const { email, password } = this.myForm.value;

    this.authService.login(email, password)
      .subscribe({
        next: (user) => {
          if (user.roles.includes('admin')) {
            this.router.navigateByUrl('/admin');
          } else {
            this.router.navigateByUrl('/');
          }
        },
        error: (message) => {
          Swal.fire('Error', message, 'error');
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      })
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

}
