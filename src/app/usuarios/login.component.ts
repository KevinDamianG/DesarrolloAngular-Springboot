import { Component, OnInit } from '@angular/core';
import {Usuario} from './usuario';
import swat from 'sweetalert2';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  titulo: string = 'Por favor, Inicie sesion..!';
  usuario : Usuario;


  constructor( private authService : AuthService, private router: Router ) {
    this.usuario = new Usuario() ;
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()){
      swat.fire('Login', `Hola ${this.authService.usuario.username}, ya estas autenticado..!`, 'info');
      this.router.navigate(['/clientes']);
    }
  }

login(): void{
  console.log(this.usuario);
  if(this.usuario.username == null || this.usuario.password==null){
      swat.fire('Error Login', 'Datos nulos, ingrese nuevamente.!', 'error')
    return;
  }

  this.authService.login(this.usuario).subscribe(r =>{
    console.log(r);

    this.authService.guardarUsuario(r.access_token);
    this.authService.guardarToken(r.access_token);

    let usuario = this.authService.usuario;

    this.router.navigate(['./clientes'])
    swat.fire('Login', `Hola ${usuario.username}, has iniciado sesion con éxito..!`, 'success');
  }, er =>{
    if(er.status==400){
        swat.fire('Error Login', 'Datos incorrectos..!', 'error')
    }
  }
 )

}



}
