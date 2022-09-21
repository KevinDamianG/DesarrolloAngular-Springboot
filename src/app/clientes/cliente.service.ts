import { Injectable } from '@angular/core';
import {formatDate, DatePipe} from '@angular/common';

//import { CLIENTES } from './clientes.json';
import {Cliente} from "./cliente";
import {HttpClient, HttpHeaders, HttpRequest, HttpEvent} from '@angular/common/http';
import {map, catchError, tap} from 'rxjs/operators';
import swal from 'sweetalert2';
import { Observable, throwError} from 'rxjs';
//import {of} from 'rxjs';
import {Region} from './region';
import {AuthService} from '../usuarios/auth.service';

import {Router} from '@angular/router';


@Injectable()
export class ClienteService {
  private url : string ='http://localhost:8080/api/clientes';
  //private httpHeaders= new HttpHeaders({'Content-Type': 'application/json'})

  //CONSTRUCTOR
  constructor(private  http: HttpClient,  private router: Router, private autService:AuthService ) { }

/*
  private agregarAutorizationHeader(){
    let token= this.autService.token;
    if(token!=null){
      return this.httpHeaders.append('Authorization', 'Bearer '+ token);
    }
    return this.httpHeaders;
  }
*/

//METODO PAR AUTORIZACION
private inNoAutorizado(e): boolean{
  if (e.status==401 ){
    if(this.autService.isAuthenticated()){
      this.autService.logout();
    }
    this.router.navigate(['/login']);
    return true;
  }
  if ( e.status==403){
    swal.fire('Acceso denegado.', `Hola ${this.autService.usuario.username} no tienes acceso`, 'warning');
    this.router.navigate(['/clientes']);
    return true;
  }
  return false;
}


// OBTENER REGIOSNES
  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(this.url+'/regiones').pipe(
      catchError (e => {
        this.inNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  getClientes(page: number): Observable<Cliente[]> {
    return this.http.get(this.url+ '/page/'+page).pipe(
      tap((response: any) => {
        (response.content as Cliente[]).forEach(cliente =>{
          console.log(cliente.nombre);
        });
      } ),
      map((response: any) => {
      //  let clientes = response as Cliente[];
      (response.content as Cliente[]).map(cliente =>{
        cliente.nombre= cliente.nombre.toUpperCase();
           return cliente;
      })
          return response;
          //  cliente.apellido= cliente.apellido.toUpperCase();
          //  let date = new DatePipe('es');
          //  cliente.createAt = date.transform(cliente.createAt, 'fullDate');
      })
    );
  }


// CREAR USUARIO
create(cliente : Cliente) : Observable<Cliente>{
  return this.http.post(this.url, cliente).pipe(
    map((res : any) => res.cliente as Cliente),
    catchError(e => {
      if(this.inNoAutorizado(e)){
          return throwError(e);
      }

      if(e.status==400){
          return throwError(e);
      }
      if(e.error.mensaje){
        console.error(e.error.mensaje);
      }

      swal.fire(e.error.mensaje, e.error.error, 'error');
      return throwError(e);
    })
  )
}

// MOATRAR LOS DATOS EN EL FORMUARIO PARA EDITAR
getCliente(id): Observable<Cliente> {
  return this.http.get<Cliente>(`${this.url}/${id}`).pipe(
    catchError(e=>{
      if(this.inNoAutorizado(e)){
          return throwError(e);
      }

      if(e.status !=401 && e.error.mensaje){
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
      }


      swal.fire('Error al editar.', e.error.mensaje, 'error');
      return throwError(e);
    })
  )
}

// ACTUALIZAR
update (cliente: Cliente ): Observable<any>{
  return this.http.put<any> (`${this.url}/${cliente.id}`, cliente).pipe(
    catchError(e => {
      if(this.inNoAutorizado(e)){
          return throwError(e);
      }
      if(e.status==400){
          return throwError(e);
      }
      if(e.error.mensaje){
        console.error(e.error.mensaje);
      }
      swal.fire(e.error.mensaje, e.error.error, 'error');
      return throwError(e);
    })
  )
}

// ELIMINAR
delete (id: number): Observable<Cliente> {
  return this.http.delete<Cliente> (`${this.url}/${id}`).pipe(
    catchError(e => {
      if(this.inNoAutorizado(e)){
          return throwError(e);
      }
      if(e.error.mensaje){
        console.error(e.error.mensaje);
      }
    swal.fire(e.error.mensaje, e.error.error, 'error');
      return throwError(e);
    })
  )
}

//SUBIR FOTO

subirFoto(archivo : File, id): Observable<HttpEvent<{}>>{
  let form = new FormData();
  form.append("archivo", archivo);
  form.append("id", id);

  /*
  let httpHeaders = new HttpHeaders();
  let token=this.autService.token;

  if(token!=null){
    httpHeaders= httpHeaders.append('Authorization', 'Bearer '+ token);
  }*/


const req= new HttpRequest('POST', `${this.url}/upload`, form, {
  reportProgress: true
//  headers: httpHeaders
});

return this.http.request(req).pipe(
  catchError (e => {
    this.inNoAutorizado(e);
    return throwError(e);
  })
);

}



}
