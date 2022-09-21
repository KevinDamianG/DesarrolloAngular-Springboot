import { Component, OnInit } from '@angular/core';
import {Cliente} from './cliente';
import {Region} from './region';
import {ClienteService} from './cliente.service';
import {Router, ActivatedRoute} from '@angular/router';
import swal from 'sweetalert2';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

regiones: Region[]
public cliente: Cliente = new Cliente()
public titulo: string = "Crear Usuario"
public errores : string[];

  constructor(private clienteService: ClienteService,
    private router: Router, private activated : ActivatedRoute)  { }


  ngOnInit() {
    this.cargarCliente()
  }

// MOSTRAR CLIENTES
cargarCliente(): void{
  this.activated.params.subscribe(params => {
    let id = params['id']
    if (id) {
      this.clienteService.getCliente(id).subscribe((cliente) => this.cliente = cliente)
    }
  });
  this.clienteService.getRegiones().subscribe(regiones=> this.regiones=regiones)
}

// CREAR CLIENTES
public create(): void{
  this.clienteService.create(this.cliente)
  .subscribe(cliente => {
    this.router.navigate(['/clientes'])
    swal.fire('Nuevo Cliente', `El cliente  ${cliente.nombre} ${cliente.apellido} ha sido creado con exito `, 'success')
  },
  err =>{
    this.errores= err.error.errors as string[];
    console.error('Codigo de error desde el backend: ' + err.status)
    console.error(err.error.errors);
  }
);
}
// ACTUALIZAR CLIENTE
update(): void {
  this.cliente.facturas=null;
  this.clienteService.update(this.cliente)
  .subscribe(json=>{
    this.router.navigate(['/clientes'])
    swal.fire('Cliente Actualizado',`${json.mensaje} ${json.cliente.nombre}`, 'success' )
  },
  err =>{
    this.errores= err.error.errors as string[];
    console.error('Codigo de error desde el backend: ' + err.status)
    console.error(err.error.errors);
  }
 )
}

compararRegion(o1: Region, o2: Region){

if(o1===undefined && o2===undefined){
  return true;

}
  return o1==null || o2==null?false: o1.id===o2.id;
}

}
