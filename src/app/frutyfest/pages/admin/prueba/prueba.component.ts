import { Component, OnInit, inject } from '@angular/core';
import { FrutyfestService } from 'src/app/frutyfest/services/frutyfest.service';

@Component({
  templateUrl: './prueba.component.html',
  styleUrls: ['./prueba.component.css']
})
export class PruebaComponent implements OnInit {

  private frutyfestService = inject(FrutyfestService);

  ngOnInit(): void {
    this.frutyfestService.setPage('admin');
  }
}
