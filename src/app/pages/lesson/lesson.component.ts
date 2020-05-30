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
  public questions = []

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
    });
    this.api.getTestByCourseId(this.course_id, this.unitNumber, this.lesson_number)
      /* .subscribe((res: any) => {
        this.test = res.test[0];
        this.api.getQuestionsByTestId(this.test.test_id).subscribe((res: any) => {
          this.test.questions = res.questions;
          this.test.questions.forEach(question => {
            this.api.getAnswersByQuestionId(question.question_id).subscribe((res: any) => {
              question.answers = res.answers;
              console.log('answers', res.answers)
            });
            console.log(this.test)
          });
        });
      }); */
      .toPromise()
      .then((res: any) => {
        this.test = res.test[0];
        this.api.getQuestionsByTestId(this.test.test_id)
          .toPromise()
          .then((res: any) => {
            this.questions = res.questions;
            this.questions.forEach(question => {
              this.api.getAnswersByQuestionId(question.question_id)
                .toPromise()
                .then((res: any) => {
                  question.answers = res.answers;
                })
                .catch(err => {
                  console.log('error', err);
                });
            });
          })
          .catch(err => {
            console.log('error', err);
          });
      })
      .catch(err => {
        console.log('error', err);
      })
  }

}
