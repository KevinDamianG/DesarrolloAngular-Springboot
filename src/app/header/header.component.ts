import {Component} from '@angular/core';
import {AuthService} from '../usuarios/auth.service'
import swal from 'sweetalert2';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent{
  title: string = "App Angular  ";

constructor(public aut : AuthService, private router: Router){
}
logout(): void{
  swal.fire('Logout', `Hola ${this.aut.usuario.username}, has cerrado sesion con exito..!`, 'success');
  this.aut.logout();
  this.router.navigate(['/login'])
}

}
