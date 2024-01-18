import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/auth/interfaces';
import { AuthService } from 'src/app/auth/services/auth.service';
import { FrutyfestService } from 'src/app/frutyfest/services/frutyfest.service';

@Component({
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css'],
})
export class InfoComponent {
  private frutyfestService = inject(FrutyfestService);
  private authService = inject(AuthService);
  public user: User | undefined;
  public loading: boolean = false;

  constructor(private route: ActivatedRoute) {
    this.route.paramMap.subscribe((params) => {
      this.getUser(params.get('id'));
    });
  }

  ngOnInit(): void {
    this.frutyfestService.setPage('participant');
  }

  ngOnDestroy(): void {
    this.frutyfestService.setPage('');
  }

  getUser(id: string | null): void {
    this.loading = true;
    this.authService.getUser(id!).subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (message) => {
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
