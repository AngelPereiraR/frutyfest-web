import { Component, ElementRef, HostListener, OnInit, Renderer2, inject } from '@angular/core';
import { FrutyfestService } from '../../services/frutyfest.service';

@Component({
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  private frutyfestService = inject(FrutyfestService);
  mostrarBoton = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.frutyfestService.setPage('index');
  }

  ngOnDestroy(): void {
    this.frutyfestService.setPage('');
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    // Verifica la visibilidad del elemento durante el desplazamiento
    this.verificarVisibilidad();
  }

  private verificarVisibilidad() {
    const modosDeJuego = document.getElementById('reglasGenerales')
    const scrollPosition = window.scrollY + window.innerHeight;
    const elementPosition = modosDeJuego!.offsetTop;

    if (scrollPosition >= elementPosition + 200) {
      this.mostrarBoton = true;
    } else {
      this.mostrarBoton = false;
    }
  }

  scrollToSection(id: string) {
    const element = this.el.nativeElement.querySelector(`#${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}
