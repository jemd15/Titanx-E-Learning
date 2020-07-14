import { Component, OnInit, EventEmitter } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user';
import { MaterializeAction, toast } from 'angular2-materialize';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { School } from '../../models/schools';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  public users: User[];
  public filter: string = '';
  public modalCreateUser = new EventEmitter<string | MaterializeAction>();
  public createUserForm: FormGroup;
  public schools: School[];
  public passConfirmationWrong = null;

  constructor(
    public formBuilder: FormBuilder,
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.api.getAllSchools().toPromise()
      .then((res: any) => {
        console.log(res.schools)
        this.schools = res.schools;
      })
      .catch(err => {
        // toast('Error en obtener escuelas', 3000);
      });
    this.createUserForm = this.createCreateUserForm();
    this.api.getAllUsers().subscribe((res: any) => {
      this.users = res.users;
      console.log(this.users);
    },
    err => {
      console.log(err);
    });
  }

  private createCreateUserForm() {
    return this.formBuilder.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required],
      rol: ['', Validators.required],
      school_school_id: ['']
    })
  }

  openCreateUserModal() {
    this.modalCreateUser.emit({ action: 'modal', params: ['open'] });
  }

  closeCreateUserModal() {
    this.modalCreateUser.emit({ action: 'modal', params: ['close'] });
    this.createUserForm.reset();
  }

  createUser() {
    if (this.checkSchool(this.createUserForm.value.school_school_id) || this.createUserForm.value.rol == 'Admin') { // si el usuario no es admin se comprueba que se le asigne un colegio existente
      if (!this.passConfirmationWrong) {
        toast('usuario creado', 3000)
        switch(this.createUserForm.value.rol){
          case 'Admin':
            this.createUserForm.value.rol = 'admin'
            break
          case 'Profesor':
            this.createUserForm.value.rol = 'teacher'
            break
          case 'Alumno':
            this.createUserForm.value.rol = 'student'
            break
          default:
            toast('Error en rol de usuario.', 3000);
            throw new Error('error en rol de usuario');
        }
        this.createUserForm.value.school_school_id = (this.schools.find(school => school.name == this.createUserForm.value.school_school_id)) ? this.schools.find(school => school.name == this.createUserForm.value.school_school_id).school_id:null;
        console.table(this.createUserForm.value);
        this.api.createUser(this.createUserForm.value).toPromise()
          .then((res: any) => {
            console.log(res.newUser);
            this.users.push(res.newUser);
            toast('Usuario creado correctamente.', 3000);
            this.closeCreateUserModal();
          })
          .catch(err => {
            if (err.error.message.search('Duplicate entry') >= 0) {
              toast('El email ya existe!', 3000);
            } else {
              toast('No se pudo procesar su solicitud. Intente nuevamente.', 3000);
            }
            switch(this.createUserForm.value.rol){
              case 'admin':
                this.createUserForm.value.rol = 'Admin'
                break
              case 'teacher':
                this.createUserForm.value.rol = 'Profesor'
                break
              case 'student':
                this.createUserForm.value.rol = 'Alumno'
                break
            }
          });
      } else {
        toast('Las contraseñas deben coincidir', 3000);
      }
    } else {
      toast('Debe seleccionar un colegio existente', 3000);
    }
  }

  changeState(user_id: number, state: string) {
    console.log('changeState to:', state);

    let newState: string;
    if (state == 'active') {
      newState = 'inactive';
    } else if (state == 'inactive') {
      newState = 'active';
    }
    console.log({ user_id, state: newState });
    this.api.changeState({ user_id, state: newState }).toPromise()
      .then((res: any) => {
        this.users.forEach(user => {
          if (user.user_id == user_id) {
            user.state = newState;
          }
        });
      })
      .catch(err => {
        console.log('error', err);
      });
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
    return this.createUserForm.controls['password'];
  }
  
  get confirm_password(): AbstractControl {
    return this.createUserForm.controls['passwordConfirm'];
  }

  // comprobación de que el colegio exista previo a la creación de un usuario
  checkSchool(schoolName: string): boolean {
    let check: boolean = false;
    for (let school of this.schools) {
      console.log(school.name, schoolName)
      if(school.name.toUpperCase() == schoolName.toUpperCase()) {
        check = true;
        break
      }
    }
    return check
  }

}
