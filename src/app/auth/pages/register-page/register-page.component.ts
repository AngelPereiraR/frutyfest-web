import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { ValidatorsService } from 'src/app/shared/service/validators.service';
import { Event } from 'src/app/frutyfest/interfaces/team.interface';

@Component({
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private validatorsService = inject(ValidatorsService);

  public events: Event[] = [];

  constructor(private cdr: ChangeDetectorRef) {
    this.events = [
      {
        event: 'FrutyFest 2'
      }
    ]
  }

  public myForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(this.validatorsService.emailPattern)]],
    name: ['', [Validators.required]],
    minecraftName: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
    hasCompanion: [false, [Validators.required]],
    companionName: [''],
    event: ['', [Validators.required]],
    presentation: ['', [Validators.required]]
  }, {
    validators: [
      this.validatorsService.isFieldOneEqualFieldTwo('password', 'confirmPassword')
    ]
  });

  showPassword = false;

  register() {
    let { email, name, minecraftName, password, hasCompanion, companionName, presentation, event } = this.myForm.value;

    if (!companionName) companionName = 'No tiene';

    if (hasCompanion === 'true') {
      hasCompanion = true;
    } else if (hasCompanion === 'false') {
      hasCompanion = false;
    }

    this.authService.register(email, password, name, minecraftName, hasCompanion, presentation, companionName, event)
      .subscribe({
        next: () => {
          Swal.fire('Registro', 'Registro correcto. Se le ha enviado un correo con las credenciales para el inicio de sesión. Si no aparece en Recibidos, por favor mire en su carpeta de Spam, gracias.', 'success')
          this.router.navigateByUrl('/');
        },
        error: (message) => {
          Swal.fire('Error', message, 'error');
        }
      })
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
