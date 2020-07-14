import { Component, OnInit, EventEmitter } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user';
import { MaterializeAction, toast } from 'angular2-materialize';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { School } from '../../models/schools';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

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
    this.api.getAllStudents().subscribe((res: any) => {
      this.users = res.students;
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
      rol: ['student', Validators.required],
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
    if (this.checkSchool(this.createUserForm.value.school_school_id)) { // comprueba que se le asigne un colegio existente al nuevo usuario
      console.table(this.createUserForm.value);
      this.api.createUser(this.createUserForm.value).toPromise()
        .then((res: any) => {
          console.log(res.newUser);
          this.users.push(res.newStudent);
          toast('Alumno creado correctamente.', 3000);
          this.closeCreateUserModal();
        })
        .catch(err => {
          if (err.error.message.search('Duplicate entry') >= 0) {
            toast('El email ya existe!', 3000);
          } else {
            toast('No se pudo procesar su solicitud. Intente nuevamente.', 3000);
          }
        });
    } else {
      toast('Debe seleccionar un colegio existente', 3000);
    }
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
