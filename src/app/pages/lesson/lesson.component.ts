import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css']
})
export class LessonComponent implements OnInit {

  public breadcrumb = {
    course: '',
    course_id: '',
    unit: '',
    lesson_number: ''
  };
  public course: string;
  public course_id: string;
  public unitNumber: string;
  public unitId: string;
  public lesson_number: string;
  public activities = [];
  public test

  constructor(
    private route: ActivatedRoute,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.course = this.route.snapshot.params['course'],
    this.course_id = this.route.snapshot.params['courseId'],
    this.unitNumber = this.route.snapshot.params['unitNumber'],
    this.unitId = this.route.snapshot.params['unitId'],
    this.lesson_number = this.route.snapshot.params['lessonNumber']
    this.breadcrumb = {
      course: this.course,
      course_id: this.course_id,
      unit: this.unitNumber,
      lesson_number: this.lesson_number
    }
    this.api.getAllActivities(this.course_id, this.unitNumber, this.lesson_number).subscribe((res: any) => {
      this.activities = res.activities;
      console.log('activities', this.activities)
    });
    this.api.getTestByCourseId(this.course_id, this.unitNumber, this.lesson_number)
      .subscribe((res: any) => {
        this.test = res.test;
        console.log(this.test)
      });
  }

}
