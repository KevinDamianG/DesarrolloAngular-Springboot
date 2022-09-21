import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Usuario} from './usuario';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _usuario: Usuario;
  private _token: string;

  constructor(private http: HttpClient) { }

  public get usuario(): Usuario{
    if(this._usuario!=null){
      return this._usuario;
    }else if(this._usuario== null && sessionStorage.getItem('usuario')!= null ){
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }

public get token(): string{
  if(this._token!=null){
    return this._token;
  }else if(this._token== null && sessionStorage.getItem('token')!= null ){
    this._token =sessionStorage.getItem('token');
    return this.token;
  }
  return null;
}

  login(usuario: Usuario):Observable<any>{
    const url='http://localhost:8080/oauth/token';

    const crede= btoa('angularapp'+':'+'12345');

    const httpHeaders = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded',
  'Authorization': 'Basic '+crede });

    let prams = new URLSearchParams();
    prams.set('grant_type', 'password');
    prams.set('username',usuario.username);
    prams.set('password',usuario.password);
    console.log(prams.toString())
    return this.http.post<any>(url, prams.toString(), {headers: httpHeaders});

  }

//----------------------
guardarUsuario(accessToken: string): void{
  let pay = this.obtenerDatosToken(accessToken);
  this._usuario= new Usuario();
  this._usuario.nombre = pay.nombre;
  this._usuario.apellido = pay.apellido;
  this._usuario.email = pay.email;
  this._usuario.username = pay.user_name;
  this._usuario.roles = pay.authorities;
sessionStorage.setItem('usuario', JSON.stringify(this._usuario));

}
//-------------------------
guardarToken(accessToken: string): void{
  this._token=accessToken;
  sessionStorage.setItem('token',accessToken);

}
//---------------------------------------
obtenerDatosToken(accessToken: string ): any{
  if(accessToken!=null){
    return JSON.parse(atob(accessToken.split(".")[1]));
  }
  return null;
}
//----------------------------
isAuthenticated(): boolean{
  let p= this.obtenerDatosToken(this.token);
  if(p!=null && p.user_name && p.user_name.length>0 ){
    return true;
  }
  return false;
}

hasRole(role: string) : boolean{
  if(this.usuario.roles.includes(role)){
    return true;
  }
  return false;
}

logout(): void{
  this._token=null;
  this._usuario=null;
  sessionStorage.clear();
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('usuario');
}


}
