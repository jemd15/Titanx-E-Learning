import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { MaterializeAction, toast } from 'angular2-materialize';
import { EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userData: any;
  loginForm: FormGroup;
  restorePassForm: FormGroup;
  modalActions = new EventEmitter<string | MaterializeAction>();

  constructor(
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    public router: Router, // para enviar al usuario a otra vista
    public formBuilder: FormBuilder,
    private auth: AuthService,
    private api: ApiService
  ) {

  }

  ngOnInit() {
    this.loginForm = this.createLoginForm();
    this.restorePassForm = this.createRestorePassFormForm();
  }

  private createLoginForm() {
    return this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  private createRestorePassFormForm() {
    return this.formBuilder.group({
      email: ['', Validators.required]
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
  
  restorePass() {
    this.api.requestRestorePass(this.restorePassForm.value.email).toPromise()
      .then((res: any) => {
        toast('Email enviado con pasos para reestablecer contraseña', 3000);
        this.closeModal();
      })
      .catch(err => {
        console.log(err);
        if (err.error.message === "The email doesn't exist on the system") {
          toast('Email no encontrado', 3000);
        }
      })
  }
}