import { Component } from '@angular/core';
import { MenuItem } from '../../interfaces/menu-item.interface';

@Component({
  selector: 'frutyfest-layout',
  templateUrl: './frutyfest-layout.component.html',
  styleUrls: ['./frutyfest-layout.component.scss']
})
export class FrutyfestLayoutComponent {

  public menuItems: MenuItem[] = [
    {path: 'auth/login', name: 'Iniciar Sesión'},
    {path: 'auth/register', name: 'Registro'},
  ];

  public scrollToSection(sectionId: string) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}
