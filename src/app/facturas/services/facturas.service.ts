import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import {Observable} from 'rxjs'
import {Factura} from '../models/factura'
import {Producto} from '../models/producto'
@Injectable({
  providedIn: 'root'
})
export class FacturasService {
  private url: string = 'http://localhost:8080/api/facturas';


  constructor(private http: HttpClient) { }

  getFatura(id: number): Observable<Factura>{
    return this.http.get<Factura>(`${this.url}/${id}`);
  }

  delete(id: number): Observable<void>{
    return this.http.delete<void>(`${this.url}/${id}`);
  }

filtrarProductos(t: string): Observable<Producto[]>{
  return this.http.get<Producto[]>(`${this.url}/filtrar-productos/${t}`);
}

create(factutra: Factura): Observable<Factura>{
  return this.http.post<Factura> (this.url, factutra);
}



}
