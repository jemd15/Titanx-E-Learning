import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Unit } from '../../models/units';
import { EventEmitter } from '@angular/core';
import { MaterializeAction, toast } from 'angular2-materialize';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/user';
import { Lesson } from '../../models/lessons';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {

  public user: User = JSON.parse(localStorage.getItem("user"));
  public breadcrumb = {
    course: '',
    course_id: ''
  }
  public course_id: string;
  public course_name: string;
  public units: Unit[];
  public modalNewUnit = new EventEmitter<string | MaterializeAction>();
  public modalNewLesson = new EventEmitter<string | MaterializeAction>();
  public newUnitForm: FormGroup;
  public newLessonForm: FormGroup;
  public modalUnit: Unit;


  constructor(
    public formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.newUnitForm = this.createNewUnitForm();
    this.newLessonForm = this.createNewLessonForm();
    this.course_id = this.route.snapshot.params['courseId'];
    this.course_name = this.route.snapshot.params['course'];
    this.breadcrumb = {
      course: this.course_name,
      course_id: this.course_id
    };
    this.api.getAllUnitsByCourseId(this.course_id).subscribe((res: any) => {
      this.units = res.units;
      for (let i = 0; i < this.units.length; i++) {
        this.api.getAllLessonsByUnitId(this.units[i].unit_id).subscribe((res: any) => {
          this.units[i].lessons = res.lessons
        });
      }
      console.log(this.units);
    });
  }

  private createNewUnitForm() {
    return this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      state: ['', Validators.required]
    })
  }

  private createNewLessonForm() {
    return this.formBuilder.group({
      title: ['', Validators.required]
    })
  }

  openUnitModal() {
    this.modalNewUnit.emit({ action: 'modal', params: ['open'] });
  }

  closeUnitModal() {
    this.modalNewUnit.emit({ action: 'modal', params: ['close'] });
    this.newUnitForm.reset();
  }

  openLessonModal(unit: Unit) {
    this.modalUnit = unit;
    console.log(this.modalUnit);
    
    this.modalNewLesson.emit({ action: 'modal', params: ['open'] });
  }

  closeLessonModal() {
    this.modalNewLesson.emit({ action: 'modal', params: ['close'] });
    this.newLessonForm.reset();
  }

  addUnit() {
    let newUnit: Unit = {
      course_course_id: this.course_id,
      description: this.newUnitForm.value.description,
      number: this.units.length + 1,
      state: this.newUnitForm.value.state,
      title: this.newUnitForm.value.title
    }
    this.api.postNewUnit(newUnit).toPromise()
      .then((res: any) => {
        console.log(res)
        newUnit.lessons = [];
        newUnit.unit_id = res.unit.unit_id
        this.units.push(newUnit);
        this.closeUnitModal();
        toast('Unidad creada', 3000);
      })
      .catch(err => {
        toast(err.message, 3000);
      });
  }

  addLesson() {
    let newLesson: Lesson = {
      number: this.modalUnit.lessons.length + 1,
      title: this.newLessonForm.value.title,
      unit_unit_id: this.modalUnit.unit_id,
      unit_course_course_id: this.modalUnit.course_course_id
    }
    console.log(newLesson)
    this.api.postNewLesson(newLesson).toPromise()
      .then(() => {
        let unitIndex = this.units.findIndex(unit => unit.unit_id === newLesson.unit_unit_id);
        this.units[unitIndex].lessons.push(newLesson);
        this.closeLessonModal();
        toast('Lección creada', 3000);
      })
      .catch(err => {
        toast('Error al crear lección', 3000);
        console.log(err);
      });
  }

}
