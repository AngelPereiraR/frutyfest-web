import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public myForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    name: ['', [Validators.required, Validators.minLength(6)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  register() {
    const {email, name, password} = this.myForm.value;

    this.authService.login(email, password)
      .subscribe({
        next: () => this.router.navigateByUrl('/#'),
        error: (message) => {
          Swal.fire('Error', message, 'error');
        }
      })
  }
}
