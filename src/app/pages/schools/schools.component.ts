import { Component, OnInit, EventEmitter } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MaterializeAction, toast } from 'angular2-materialize';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { School } from '../../models/schools';

@Component({
  selector: 'app-schools',
  templateUrl: './schools.component.html',
  styleUrls: ['./schools.component.css']
})
export class SchoolsComponent implements OnInit {

  public filter: string = '';
  public modalCreateSchool = new EventEmitter<string | MaterializeAction>();
  public createSchoolForm: FormGroup;
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
      })
      .catch(err => {
        // toast('Error en obtener escuelas', 3000);
      });
    this.createSchoolForm = this.createCreateSchoolForm();
  }

  private createCreateSchoolForm() {
    return this.formBuilder.group({
      name: ['', Validators.required]
    })
  }

  openCreateSchoolModal() {
    this.modalCreateSchool.emit({ action: 'modal', params: ['open'] });
  }

  closeCreateSchoolModal() {
    this.modalCreateSchool.emit({ action: 'modal', params: ['close'] });
    this.createSchoolForm.reset();
  }

  createSchool() {
    console.table(this.createSchoolForm.value);
    this.api.createSchool(this.createSchoolForm.value).toPromise()
      .then((res: any) => {
        this.schools.push(this.createSchoolForm.value);
        console.log(res.newSchool);
        toast('Colegio creado correctamente.', 3000);
        this.closeCreateSchoolModal();
      })
      .catch(err => {
        console.log(err);
        toast('No se pudo procesar su solicitud. Intente nuevamente.', 3000);
      });
  }

}
