import {
  ChangeDetectorRef,
  Component,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FrutyfestService } from 'src/app/frutyfest/services/frutyfest.service';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './trial-add.component.html',
  styleUrls: ['./trial-add.component.css'],
})
export class TrialAddComponent {
  private frutyfestService = inject(FrutyfestService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  //TODO 2: Añadir campo boolean "Comienzo de fase"
  //TODO 2: Añadir campo boolean "Final de fase"
  //TODO 2: Añadir campo number "Fase"
  public myForm: FormGroup = this.fb.group({
    name: [
      'Nombre del modo de juego',
      [Validators.required, Validators.minLength(1)],
    ],
    maxPoints: [0, [Validators.required, Validators.min(1)]],
    pointsDecrease: [0, [Validators.required, Validators.min(1)]],
    maxTeams: [0, [Validators.required, Validators.min(1)]],
  });

  constructor(private cdr: ChangeDetectorRef) {}

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

  addTrial(): void {
    //TODO 2: Añadir campos "Comienzo de fase", "Final de fase" y "Fase"
    const { name, maxPoints, pointsDecrease, maxTeams } = this.myForm.value;

    this.frutyfestService
      .addTrial(name, maxPoints, pointsDecrease, maxTeams)
      .subscribe({
        next: (team) => {
          Swal.fire(
            'Creación',
            'Creación del modo de juego correcta',
            'success'
          );
          this.router.navigateByUrl('/admin/trial');
        },
        error: (message) => {
          Swal.fire('Error', message, 'error');
        },
      });
  }
}
