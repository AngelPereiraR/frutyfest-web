import { Component } from '@angular/core';
import { MenuItem } from '../../interfaces/menu-item.interface';

@Component({
  selector: 'frutyfest-layout',
  templateUrl: './frutyfest-layout.component.html',
  styleUrls: ['./frutyfest-layout.component.css']
})
export class FrutyfestLayoutComponent {

  public menuItems: MenuItem[] = [
    {path: 'auth/login', name: 'Iniciar Sesión'},
    {path: 'auth/register', name: 'Registrar'},
  ];
}
