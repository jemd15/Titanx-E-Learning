import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { Router, ActivatedRoute } from "@angular/router";
import { toast } from 'angular2-materialize';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-restore-pass',
  templateUrl: './restore-pass.component.html',
  styleUrls: ['./restore-pass.component.css']
})
export class RestorePassComponent implements OnInit {
  restorePassForm: FormGroup;
  public passConfirmationWrong = null;
  private token: string;

  constructor(
    private route: ActivatedRoute,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    public router: Router, // para enviar al usuario a otra vista
    public formBuilder: FormBuilder,
    private api: ApiService
  ) {

  }

  ngOnInit() {
    this.token = this.route.snapshot.params['token'];
    this.restorePassForm = this.createRestorePassForm();
  }

  private createRestorePassForm() {
    return this.formBuilder.group({
      password: ['', Validators.required],
      passwordCheck: ['', Validators.required]
    })
  }

  public restorePass() {
    this.api.restorePass(this.restorePassForm.value.passwordCheck, this.token).toPromise()
      .then(res => {
        toast('Contraseña actualizada correctamente', 3000);
      })
      .catch(err => {
        console.log(err);
      })
  }

  // confirm new password validator
  onPasswordChange() {
    if (this.confirm_password.value == this.password.value) {
      this.confirm_password.setErrors({ mismatch: false });
      this.passConfirmationWrong = false;
    } else {
      this.confirm_password.setErrors({ mismatch: true });
      this.passConfirmationWrong = true;
    }
  }
  
  // getting the form control elements
  get password(): AbstractControl {
    return this.restorePassForm.controls['password'];
  }
  
  get confirm_password(): AbstractControl {
    return this.restorePassForm.controls['passwordCheck'];
  }

}
