import { Component, OnInit } from '@angular/core';
import {Factura} from './models/factura'
import {ClienteService} from '../clientes/cliente.service'
import {ActivatedRoute, Router} from '@angular/router'
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {FacturasService} from './services/facturas.service'
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete'
import {Producto} from './models/producto'
import {ItemFactura} from './models/item-factura'
import swal from 'sweetalert2';
@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html'
})
export class FacturasComponent implements OnInit {

titulo: string = 'Nueva Factura'
factura: Factura = new Factura();

autocompleteControl = new FormControl();
productosFiltrados: Observable<Producto[]>;

constructor(private clienteService: ClienteService,
private activatedRoute: ActivatedRoute,
private facturasService: FacturasService,
private router: Router ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(p =>{
      let clienteId = +p.get('clienteId');
      this.clienteService.getCliente(clienteId).subscribe(cli =>this.factura.cliente= cli);
    });

    this.productosFiltrados = this.autocompleteControl.valueChanges.pipe(
      map(value =>typeof value === 'string'? value: value.nombre),
      flatMap(value => value ?  this._filter(value): [])
    );

  }


 private _filter(value: string): Observable<Producto[]> {
   const filterValue = value.toLowerCase();

   return this.facturasService.filtrarProductos(filterValue);
 }

mostrarNombre(producto?: Producto): string |undefined{
  return producto?producto.nombre : undefined;
}

seleccionarProducto(event: MatAutocompleteSelectedEvent): void{
  let producto = event.option.value as Producto;
  console.log(producto);
  if(this.existeItem(producto.id)){
    this.incrementaCantidad(producto.id);
  }else{
    let nuevoItem = new ItemFactura();
    nuevoItem.producto= producto;
    this.factura.items.push(nuevoItem);
  }



  this.autocompleteControl.setValue('');
  event.option.focus();
  event.option.deselect();

}

actualizarCantidad(id: number, event: any): void{
  let cantidad: number = event.target.value as number;

  if(cantidad==0){
    return this.eliminarItemFactura(id);
  }

  this.factura.items = this.factura.items.map((item: ItemFactura) =>{
    if(id ===item.producto.id){
      item.cantidad=cantidad;
    }
    return item;
  })
}

existeItem(id: number): boolean{
  let existe = false;
  this.factura.items.forEach((item: ItemFactura) =>{
    if (id===item.producto.id){
      existe=true;
    }
  })
  return existe;
}
incrementaCantidad(id: number): void{
  this.factura.items = this.factura.items.map((item: ItemFactura) =>{
    if(id ===item.producto.id){
      ++item.cantidad;
    }
    return item;
  });
}
eliminarItemFactura(id: number): void{
  this.factura.items = this.factura.items.filter((item: ItemFactura) => id!==item.producto.id);
}

create(): void{
  console.log(this.factura);
  this.facturasService.create(this.factura).subscribe(factura => {
      swal.fire(this.titulo, `Factura ${factura.descripcion} creada con exito.`, 'success');
      this.router.navigate(['/facturas', factura.id])
  })
}





}
