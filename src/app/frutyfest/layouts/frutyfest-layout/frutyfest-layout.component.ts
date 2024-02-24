import { Component, DoCheck, inject } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { FrutyfestService } from '../../services/frutyfest.service';

@Component({
  selector: 'frutyfest-layout',
  templateUrl: './frutyfest-layout.component.html',
  styleUrls: ['./frutyfest-layout.component.scss'],
})
export class FrutyfestLayoutComponent implements DoCheck {
  private authService = inject(AuthService);
  private frutyfestService = inject(FrutyfestService);

  isSecondHidden: boolean = false;
  isThirdHidden: boolean = false;
  currentUser = this.authService.currentUser;
  authStatus = this.authService.authStatus;
  page: null | string = null;

  public scrollToSection(sectionId: string) {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo(0, section.offsetTop - 150);
    }
  }

  ngDoCheck() {
    let currentPage = this.frutyfestService.currentPage;
    this.page = currentPage();
    this.currentUser = this.authService.currentUser;
  }

  public showSecondHiddenContent() {
    this.isSecondHidden = true;
  }

  public hideSecondHiddenContent() {
    this.isSecondHidden = false;
  }

  public showThirdHiddenContent() {
    this.isThirdHidden = true;
  }

  public hideThirdHiddenContent() {
    this.isThirdHidden = false;
  }

  public hideBothHiddenContent() {
    this.isSecondHidden = false;
    this.isThirdHidden = false;
  }

  logout() {
    this.authService.logout();
  }
}
