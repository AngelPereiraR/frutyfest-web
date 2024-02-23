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
  public loading: boolean = false;

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
    presentation: ['', [Validators.required]],
    policies: [false, [Validators.requiredTrue]],
  }, {
    validators: [
      this.validatorsService.isFieldOneEqualFieldTwo('password', 'confirmPassword')
    ]
  });

  showPassword = false;

  register() {
    this.loading = true;
    let { email, name, minecraftName, password, hasCompanion, companionName, presentation, event } = this.myForm.value;

    if (!companionName) companionName = 'No tiene';

    this.authService.register(email, password, name, minecraftName, hasCompanion, presentation, companionName, event)
      .subscribe({
        next: () => {
          Swal.fire('Registro', 'Se le ha enviado un correo confirmando que el registro ha sido correcto. Si no aparece en Recibidos, por favor mire en su carpeta de Spam, gracias.', 'success')
          this.router.navigateByUrl('/');
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

  mostrarPoliticas() {
    const politicasHTML = `
      <div>
        <h2>Política de Privacidad y Normas de Uso de FrutyFest</h2>
        <p>Fecha de última actualización: 23/01/2024</p>
        <br>

        <h3>1. Información Recopilada</h3>
        <p>Para registrarte en FrutyFest, requerimos la siguiente información:</p>
        <ul>
          <li>Nombre de Twitch</li>
          <li>Nombre de Minecraft</li>
          <li>Correo electrónico</li>
        </ul>
        <br>
        <p>Esta información es esencial para llevar a cabo el proceso de registro y facilitar la comunicación relacionada con el evento.</p>
        <br>

        <h3>2. Uso de Datos</h3>
        <p>Garantizamos que no utilizaremos cookies ni recopilaremos datos adicionales más allá de los proporcionados voluntariamente por los usuarios durante el proceso de registro. El correo electrónico se utilizará exclusivamente para:</p>
        <ul>
          <li>Confirmación de registro realizado.</li>
          <li>Recuperación de contraseña.</li>
        </ul>
        <br>
        <br>

        <h3>3. Requisitos para Participar</h3>
        <p>Para ser elegible para participar en FrutyFest, debes cumplir con los siguientes requisitos:</p>
        <ul>
          <li>Ser mayor de edad.</li>
          <li>Estar afiliado a Twitch.</li>
          <li>Tener constancia a la hora de hacer directos.</li>
          <li>Contar con una cuenta de PayPal u otro medio de pago disponible.</li>
          <li>Poseer una cuenta de Minecraft Premium.</li>
        </ul>
        <br>

        <h3>4. Empates en Puntuación</h3>
        <p>En caso de empate de puntos entre un equipo clasificado y otro no clasificado para la siguiente fase, la prioridad se determinará según el orden de registro y creación de los equipos.</p>
        <br>

        <h3>5. Seguridad de Datos</h3>
        <p>Nos comprometemos a tomar medidas adecuadas para garantizar la seguridad de los datos proporcionados. Implementaremos medidas técnicas y organizativas para proteger la información contra accesos no autorizados y garantizar su confidencialidad.</p>
        <br>

        <h3>6. Derechos del Usuario</h3>
        <p>Como participante, tienes derechos sobre tus datos personales, incluyendo el acceso, rectificación, cancelación y oposición. Puedes ejercer estos derechos enviando un correo electrónico a <a href="mailto:drosterradioactive@gmail.com">drosterradioactive@gmail.com</a>.</p>
        <br>

        <h3>7. Cambios en la Política</h3>
        <p>Nos reservamos el derecho de actualizar esta política en cualquier momento. Te recomendamos revisar periódicamente la política para estar al tanto de cualquier cambio.</p>
        <br>

        <p>Al registrarte en FrutyFest, aceptas las condiciones establecidas en esta Política de Privacidad y Normas de Uso. Si tienes alguna pregunta o inquietud, no dudes en ponerte en contacto con nosotros a través de <a href="mailto:drosterradioactive@gmail.com">drosterradioactive@gmail.com</a>.</p>
        <br>
        <p>Gracias por ser parte de FrutyFest. ¡Buena suerte en el evento!</p>
      </div>
    `;

    Swal.fire({
      title: 'Política de Privacidad y Normas de Uso',
      html: politicasHTML,
      icon: 'info',
      confirmButtonText: 'Entendido',
    });
  }
}
