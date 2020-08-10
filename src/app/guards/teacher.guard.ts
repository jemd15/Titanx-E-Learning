import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TeacherGuard implements CanActivate {

  constructor(
    private router: Router,
    private auth: AuthService
  ) { }

  canActivate() {
    if (this.auth.userData().rol == 'teacher' || this.auth.userData().rol == 'admin') {
      return true;
    }

    console.log('No existe la pagina solicitada');
    this.router.navigate(['404-not-found']);
    return false;
  }
  
}
