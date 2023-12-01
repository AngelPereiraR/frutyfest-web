import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/auth/interfaces';
import { AuthService } from 'src/app/auth/services/auth.service';
import { FrutyfestService } from 'src/app/frutyfest/services/frutyfest.service';

@Component({
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css']
})
export class RecordComponent {
  private frutyfestService = inject(FrutyfestService);
  private authService = inject(AuthService);
  private userId: string = '';
  public user: User | undefined;

  constructor(
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe(params => {
      this.getUser(params.get('id'));
    });
  }

  ngOnInit(): void {
    this.frutyfestService.setPage('admin');
  }

  ngOnDestroy(): void {
    this.frutyfestService.setPage('');
  }

  getUser(id: string | null): void {
    this.authService.getUser(id!).subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (message) => {
      }
    });
  }
}
