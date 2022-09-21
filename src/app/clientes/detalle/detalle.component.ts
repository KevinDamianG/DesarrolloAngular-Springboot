import { Component, OnInit,Input } from '@angular/core';
import {Cliente} from '../cliente';
import {ClienteService} from '../cliente.service';
import {ModalService} from './modal.service';
import {AuthService} from '../../usuarios/auth.service'
import swal from 'sweetalert2';
import {HttpEventType} from '@angular/common/http';
import {FacturasService} from '../../facturas/services/facturas.service'
import {Factura} from '../../facturas/models/factura';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
@Input() cliente: Cliente;
titulo : string = "DETALLE DEL CLIENTE";
public ima : File;
progreso: number =0;

  constructor(private clienteService: ClienteService,
    private facturasService: FacturasService,
    public modalS: ModalService,
     public authService: AuthService ) { }

  ngOnInit(): void {

  }

  seleccionarFoto(event){
    this.ima= event.target.files[0];
    this.progreso=0;
    if(this.ima.type.indexOf('image')<0 ){
      swal.fire('Error Archivo', 'Debe seleccionar un archivo correcto', 'error')
      this.ima=null;
    }
  }

  subirFoto(){
    if(!this.ima){
      swal.fire('Error al subir Foto', 'Debe seleccionar una foto', 'error')
    }
    else {
    this.clienteService.subirFoto(this.ima, this.cliente.id)
    .subscribe(event =>{
      if(event.type===HttpEventType.UploadProgress){
        this.progreso = Math.round((event.loaded/event.total)*100)
      }else if(event.type===HttpEventType.Response){
        let response: any = event.body;
        this.cliente= response.cliente as Cliente;
        this.modalS.notifica.emit(this.cliente);

          swal.fire('La foto se ha subido correctamente!', response.mensaje, 'success')
      }

      //this.cliente=cliente;

    })
    }
  }

cerrarModal(){
  this.modalS.cerrarModal();
  this.ima=null;
  this.progreso=0;
}

delete(factura: Factura): void {
  const swalWithBootstrapButtons = swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })

  swalWithBootstrapButtons.fire({
    title: 'Estas Seguro?',
    text: `¿Seguro que deseas aliminar la factura ${factura.descripcion} ?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Si, eliminar!',
    cancelButtonText: 'No, cancelar!',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      this.facturasService.delete(factura.id).subscribe(
        response => {
          this.cliente.facturas = this.cliente.facturas.filter(f => f!==factura)
          swalWithBootstrapButtons.fire(
            'Factura Eliminada!',
            `Factura ${factura.descripcion} eliminada con exito..!`,
            'success'
          )
        }
      )

    }
  });


}

}
