import { Component, OnInit, EventEmitter } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user';
import { MaterializeAction, toast } from 'angular2-materialize';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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

  constructor(
    public formBuilder: FormBuilder,
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.api.getAllSchools().toPromise()
      .then((res: any) => {
        console.log(res.schools)
        this.schools = res.schools;
        this.schools.unshift({ name: 'Colegio' });
      })
      .catch(err => {
        toast('Error en obtener escuelas', 3000);
      });
    this.createUserForm = this.createCreateUserForm();
    this.api.getAllUsers().subscribe((res: any) => {
      this.users = res.users;
      console.log(this.users);
    },
      err => {
        console.log(err)
      });
  }

  private createCreateUserForm() {
    return this.formBuilder.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
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
    console.log(this.createUserForm.value)
    /* this.api.createUser().toPromise()
      .then((res: any) => {

      }) */
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
        console.log(err)
      })
  }

}
