import { Component, OnInit, inject } from '@angular/core';
import { FrutyfestService } from '../../services/frutyfest.service';

@Component({
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  private frutyfestService = inject(FrutyfestService);

  ngOnInit(): void {
    this.frutyfestService.setPage('index');
  }

  ngOnDestroy(): void {
    this.frutyfestService.setPage('');
  }
}
