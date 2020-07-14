import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidationErrors, AbstractControl, FormControl } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { toast } from 'angular2-materialize';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  public changeDataForm: FormGroup;
  public changePassForm: FormGroup;
  private user: User;
  public passConfirmationWrong = null;

  constructor(
    public formBuilder: FormBuilder,
    private api: ApiService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.user = this.auth.userData();
    this.changeDataForm = this.createChangeDataForm();
    this.changePassForm = this.createChangePassForm();
  }

  changeData() {
    console.log(this.user.user_id, this.changeDataForm.value.name, this.changeDataForm.value.lastName, this.changeDataForm.value.email);
    
    this.api.updateUser(this.user.user_id, this.changeDataForm.value.name, this.changeDataForm.value.lastName, this.changeDataForm.value.email, this.user.email).toPromise()
      .then((res: any) => {
        this.auth.setUserName(this.changeDataForm.value.name);
        this.auth.setUserLastName(this.changeDataForm.value.lastName);
        this.auth.setUserEmail(this.changeDataForm.value.email);
        toast('Datos guardados correctamente', 1500);
      })
      .catch(err => {
        toast('No se han podido guardar los datos', 3000);
        console.log({ err });
      });
  }

  changePass() {
    console.log(this.user.user_id, this.changePassForm.value.password, this.changePassForm.value.newPassword, this.user.email);
    if(!this.passConfirmationWrong){
      this.api.changePassUser(this.user.user_id, this.changePassForm.value.password, this.changePassForm.value.newPassword, this.user.email).toPromise()
        .then(() => {
          toast('Contraseña actualizada correctamente', 1500);
        })
        .catch(err => {
          toast('No se han podido actualizar la contraseña', 3000);
          console.log({ err });
        });
    } else {
      toast('Las contraseñas deben coincidir', 3000);
    }
  }

  private createChangeDataForm() {
    return this.formBuilder.group({
      name: [this.auth.userData().name, Validators.required],
      lastName: [this.auth.userData().lastName, Validators.required],
      email: [this.auth.userData().email, Validators.required]
    })
  }

  private createChangePassForm() {
    return this.formBuilder.group({
      password: ['', Validators.required],
      newPassword: ['', Validators.required],
      newPassword2: ['', Validators.required]
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
    return this.changePassForm.controls['newPassword'];
  }
  
  get confirm_password(): AbstractControl {
    return this.changePassForm.controls['newPassword2'];
  }
}
