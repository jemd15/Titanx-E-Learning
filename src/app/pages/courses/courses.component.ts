import { Component, OnInit } from '@angular/core';
import { Course } from '../../models/courses';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user';
import { EventEmitter } from '@angular/core';
import { MaterializeAction, toast } from 'angular2-materialize';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

  public courses: Course[];
  public user: User;
  public modalNewCourse = new EventEmitter<string | MaterializeAction>();
  public newCourseForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.newCourseForm = this.createNewCoruseForm();
    this.user = JSON.parse(localStorage.getItem('user'));
    this.api.getAllCourses().subscribe((res: any) => {
      this.courses = res.courses;
      console.log(this.courses);

    })
  }

  private createNewCoruseForm() {
    return this.formBuilder.group({
      name: ['', Validators.required],
      img_url: ['', Validators.required]
    })
  }

  openCourseModal() {
    this.modalNewCourse.emit({ action: 'modal', params: ['open'] });
  }

  closeCourseModal() {
    this.modalNewCourse.emit({ action: 'modal', params: ['close'] });
    this.newCourseForm.reset();
  }

  addCourse() {
    let newCourse: Course = {
      school_id: this.user.school_school_id,
      course: this.newCourseForm.value.name,
      img_url: this.newCourseForm.value.img_url,
      teacher_teacher_id: this.user.teacher_id,
      teacher: this.user.name + ' ' + this.user.lastName
    }
    this.api.postNewCourse(newCourse).toPromise()
      .then((res: any) => {
        newCourse.course_id = res.newCourse.course_id
        this.courses.push(newCourse);
        toast('Curso creado', 3000);
        this.closeCourseModal();
      })
      .catch(err => {
        toast('Error al crear curso', 3000);
        console.log(err);
      })
  }

}
