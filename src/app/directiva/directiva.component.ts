import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html',
})
export class DirectivaComponent  {

listacurso : string[] = ["Typescript", "Jascript", "java",  "php"];
habilitar: boolean= true;

  constructor() { }

sethabilitar(): void {
  this.habilitar= (this.habilitar==true)? false:true;
}
}
