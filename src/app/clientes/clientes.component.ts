import { Component, OnInit} from '@angular/core';
import {Cliente} from "./cliente";
import {ClienteService} from './cliente.service';
import {ModalService} from './detalle/modal.service';
import { tap} from 'rxjs/operators';
import swal from 'sweetalert2';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../usuarios/auth.service'

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  paginador : any;
  clienteSelec: Cliente

  constructor(private clienteservice: ClienteService,
    public modalService: ModalService,
    private activatedRoute: ActivatedRoute ,
    public authService: AuthService) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params=>{
    let page: number = +params.get('page');
    if(!page){
      page=0;
    }
      this.clienteservice.getClientes(page)
      .pipe(
        tap((response: any) => {
          (response.content as Cliente[]).forEach(cliente=>{
            console.log(cliente.nombre);
          });
        })
      ).subscribe(response  => {
        this.clientes = response.content as Cliente[];
        this.paginador= response;
      }
        );
    });

    this.modalService.notifica.subscribe(cliente=>{
      this.clientes= this.clientes.map(clienteO =>{
        if(cliente.id==clienteO.id){
          clienteO.foto=cliente.foto;
        }
        return clienteO;
      })
    })
    }


delete (cliente : Cliente): void {
  const swalWithBootstrapButtons = swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })

  swalWithBootstrapButtons.fire({
    title: 'Estas Seguro?',
    text: `¿Seguro que deseas aliminar al cliente ${cliente.nombre} ${cliente.apellido} ?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Si, eliminar!',
    cancelButtonText: 'No, cancelar!',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      this.clienteservice.delete(cliente.id).subscribe(
        response => {
          this.clientes = this.clientes.filter(cli => cli!==cliente)
          swalWithBootstrapButtons.fire(
            'Cliente Eliminado!',
            `Cliente ${cliente.nombre} eliminado con exito..!`,
            'success'
          )
        }
      )

    }
  });


}

abrirModal(cliente: Cliente){
  this.clienteSelec=cliente;
  this.modalService.abrirModal();
}



}
