import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from "@angular/router";
import { toast, MaterializeAction } from 'angular2-materialize';
import { EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userData: any;
  loginForm: FormGroup;
  modalActions = new EventEmitter<string | MaterializeAction>();

  constructor(
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    public router: Router, // para enviar al usuario a otra vista
    public formBuilder: FormBuilder,
    private auth: AuthService
  ) {

  }

  ngOnInit() {
    this.loginForm = this.createLoginForm();
  }

  private createLoginForm() {
    return this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  login(){
    let email = this.loginForm.value.email;
    let password = this.loginForm.value.password;
    this.auth.login(email, password);
  }

  openModal() {
    this.modalActions.emit({ action: 'modal', params: ['open'] });
	}

	closeModal() {
    this.modalActions.emit({ action: 'modal', params: ['close'] });
	}
}