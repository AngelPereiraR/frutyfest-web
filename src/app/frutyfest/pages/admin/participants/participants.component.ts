import { Component, inject } from '@angular/core';
import { FrutyfestService } from 'src/app/frutyfest/services/frutyfest.service';

@Component({
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.css']
})
export class ParticipantsComponent {

  private frutyfestService = inject(FrutyfestService);

  ngOnInit(): void {
    this.frutyfestService.setPage('admin');
  }

  ngOnDestroy(): void {
    this.frutyfestService.setPage('');
  }
}
