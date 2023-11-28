import { Component, inject } from '@angular/core';
import { MenuItem } from '../../interfaces/menu-item.interface';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'frutyfest-layout',
  templateUrl: './frutyfest-layout.component.html',
  styleUrls: ['./frutyfest-layout.component.scss']
})
export class FrutyfestLayoutComponent {
  private authService = inject(AuthService);

  isHidden: boolean = false;
  currentUser = this.authService.currentUser;
  authStatus = this.authService.authStatus;

  public scrollToSection(sectionId: string) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  public showHiddenContent() {
    this.isHidden = true;
  }

  public hideHiddenContent() {
    this.isHidden = false;
  }

  logout() {
    this.authService.logout();
  }
}
