import { Component, OnInit } from '@angular/core';
import {FacturasService} from './services/facturas.service'
import {Factura} from './models/factura';
import {ActivatedRoute} from '@angular/router'

@Component({
  selector: 'app-detalle-factura',
  templateUrl: './detalle-factura.component.html'
})
export class DetalleFacturaComponent implements OnInit {

factura: Factura;
titulo: string = 'Factura';
  constructor( private faturaservice: FacturasService, private activatedRouter:ActivatedRoute ) { }

  ngOnInit(): void {
    this.activatedRouter.paramMap.subscribe(par =>{
      let id = +par.get('id');
      this.faturaservice.getFatura(id).subscribe(factura => this.factura = factura);
    });
  }

}
