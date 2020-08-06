import { Component, OnInit } from '@angular/core';
import { Course } from '../../models/courses';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user';
import { EventEmitter } from '@angular/core';
import { MaterializeAction, toast } from 'angular2-materialize';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

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
  public modalAddStudent = new EventEmitter<string | MaterializeAction>();
  public students: User[];
  public courseStudents: User[] = [];
  public courseSelected: number;

  constructor(
    public formBuilder: FormBuilder,
    private api: ApiService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.newCourseForm = this.createNewCoruseForm();
    this.user = this.auth.userData();
    this.api.getAllCourses().subscribe((res: any) => {
      this.courses = res.courses;
    });
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

  openAddStudentModal(school_id, course_id) {
    this.courseSelected = course_id;
    this.api.getStudentsBySchoolId(school_id).toPromise()
      .then((res: any) => {
        let students = res.students;
        console.log({students});
        this.api.getStudentsByCourseId(course_id).toPromise()
          .then((res: any) => {
            this.modalAddStudent.emit({ action: 'modal', params: ['open'] });
            this.students = students;
            this.courseStudents = res.students;
            console.log(this.courseStudents);
            this.deleteDuplicatedStudents()
          })
          .catch(err => {
            toast('Error al consultar estudiantes del curso', 3000);
          });
      })
      .catch(err => {
        toast('Error al consultar estudiantes', 3000);
      });
  }

  closeAddStudentModal() {
    this.modalAddStudent.emit({ action: 'modal', params: ['close'] });
    this.students = [];
    this.courseStudents = [];
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
        toast('Curso creado', 1500);
        this.closeCourseModal();
      })
      .catch(err => {
        toast('Error al crear curso', 3000);
        console.log(err);
      })
  }

  addStudentToCourse(student: User) {
    console.log('addStudentToCourse()', student.user_id);
    this.api.asignStudentToCourse(this.courseSelected, student.student_id, student.school_school_id).toPromise()
      .then(() => {
        let studentToDelete = this.students.indexOf(student);
        this.students.splice(studentToDelete, 1);
        this.courseStudents.push(student);
        toast('Estudiante agregado al curso', 1500);
      })
      .catch(err => {
        toast('Error al agregar estudiante', 3000);
        console.log(err);
      })
  }

  removeStudentToCourse(student: User) {
    console.log('addStudentToCourse()', student.user_id);
    this.api.removeStudentToCourse(this.courseSelected, student.student_id).toPromise()
      .then(() => {
        let studentToDelete = this.courseStudents.indexOf(student);
        this.courseStudents.splice(studentToDelete, 1);
        this.students.push(student);
        toast('Estudiante removido del curso', 1500);
      })
      .catch(err => {
        toast('Error al remover estudiante', 3000);
        console.log(err);
      })
  }

  deleteDuplicatedStudents() {
    console.log('estudiantes', this.students);
    this.courseStudents.forEach(studentInCourse => {
      this.students.forEach((student, i) => {
        if(studentInCourse.user_id == student.user_id) {
          this.students.splice(student[i], 1);
        }
      });
    });
  }

}
