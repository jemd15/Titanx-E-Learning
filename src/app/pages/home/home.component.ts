import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

  scrollTo(element: string) {
    document.querySelector(element).scrollIntoView({
      behavior: 'smooth'
    });
  }

  @HostListener("window:scroll", ['$event'])
  showActionButton($event: Event) {
    let actionButton = document.querySelector('.btn-floating');
    let distanceOfTop = document.documentElement.scrollTop; // distancia desde el punto más alto hasta el scroll actual.
    if (distanceOfTop > 690) {
      actionButton.setAttribute('style', 'opacity: 1'); // aquí se agrega propiedad css quizas de una forma incorrecta, pero funcional.
      actionButton.classList.remove("disabled"); // deshabilitamos el botón cuando no se muestra
    } else {
      actionButton.setAttribute('style', 'opacity: 0'); // aquí se agrega propiedad css quizas de una forma incorrecta, pero funcional.
      actionButton.classList.add("disabled"); // volvemos a habilitar el botón cuando es visible
    }

  }

}
