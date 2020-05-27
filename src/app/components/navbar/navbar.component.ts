import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public user: User = JSON.parse(localStorage.getItem('userData'));

  constructor() { }

  ngOnInit() {

  }

  isLogged(){
    if(this.user){
      return true
    } else {
      return false
    }
  }

  logout(){
    localStorage.removeItem('userData');
  }

}
