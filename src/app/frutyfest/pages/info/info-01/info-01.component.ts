import { Component, ElementRef, HostListener, Renderer2, inject } from '@angular/core';
import { FrutyfestService } from 'src/app/frutyfest/services/frutyfest.service';

@Component({
  templateUrl: './info-01.component.html',
  styleUrls: ['./info-01.component.scss']
})
export class Info01Component {
  private frutyfestService = inject(FrutyfestService);
  mostrarBoton = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.frutyfestService.setPage('frutyfest01');
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
