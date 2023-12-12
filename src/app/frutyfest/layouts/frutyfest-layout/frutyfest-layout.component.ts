import { Component, DoCheck, inject } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { FrutyfestService } from '../../services/frutyfest.service';

@Component({
  selector: 'frutyfest-layout',
  templateUrl: './frutyfest-layout.component.html',
  styleUrls: ['./frutyfest-layout.component.scss']
})
export class FrutyfestLayoutComponent implements DoCheck {
  private authService = inject(AuthService);
  private frutyfestService = inject(FrutyfestService);

  isHidden: boolean = false;
  currentUser = this.authService.currentUser;
  authStatus = this.authService.authStatus;
  page: null | string = null;

  public scrollToSection(sectionId: string) {
    console.log(sectionId)
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  ngDoCheck() {
    let currentPage = this.frutyfestService.currentPage;
    this.page = currentPage();
    this.currentUser = this.authService.currentUser;
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
