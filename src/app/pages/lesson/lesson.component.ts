import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Test } from '../../models/tests';
import { Activity } from '../../models/activities';
import { Question } from '../../models/questions';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms'
import { User } from '../../models/user';
import { EventEmitter } from '@angular/core';
import { MaterializeAction, toast } from 'angular2-materialize';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css']
})
export class LessonComponent implements OnInit {

  public user: User = JSON.parse(localStorage.getItem("user"));
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
  public activities: Activity[] = [];
  public test: Test;
  public questions: Question[] = [];
  public testForm: FormGroup;
  public newActivityForm: FormGroup;
  public modalNewActivity = new EventEmitter<string | MaterializeAction>();

  constructor(
    private route: ActivatedRoute,
    public formBuilder: FormBuilder,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.testForm = this.createTestForm();
    this.newActivityForm = this.createNewActivityForm();
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
      .toPromise()
      .then((res: any) => {
        if(res.test.length > 0){
          this.test = res.test[0];
          this.api.getQuestionsByTestId(this.test.test_id)
            .toPromise()
            .then((res: any) => {
              this.questions = res.questions;
              this.questions.forEach(question => {
                this.addAnswer();
                this.api.getAnswersByQuestionId(question.question_id)
                  .toPromise()
                  .then((res: any) => {
                    question.answers = res.answers;
                  })
                  .catch(err => {
                    console.log('error', err);
                  });
                });
              console.log('question', this.questions)
              console.log(this.testForm.value.answers)
            })
            .catch(err => {
              console.log('error', err);
            });
        }
      })
      .catch(err => {
        console.log('error', err);
      })
  }

  private createTestForm() {
    return this.formBuilder.group({
      answers: this.formBuilder.array([
        this.formBuilder.group({
          answer: ['']
        })
      ])
    });
  }

  private createNewActivityForm() {
    return this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      type: ['', Validators.required],
      url: ['', Validators.required]
    })
  }

  get answers(){
    return (<FormArray>this.testForm.get('answers')).controls;
  }

  private addAnswer() {
    const testFormGroup  = this.formBuilder.group({
      answer: ''
    });
    this.answers.push(testFormGroup);
  }

  openActivityModal() {
    this.modalNewActivity.emit({ action: 'modal', params: ['open'] });
  }

  closeActivityModal() {
    this.modalNewActivity.emit({ action: 'modal', params: ['close'] });
    this.newActivityForm.reset();
  }

  addActivity() {
    let newActivity: Activity = { 
      number: this.activities.length + 1,
      title: this.newActivityForm.value.title,
      description: this.newActivityForm.value.description, 
      type: this.newActivityForm.value.type, 
      url: this.newActivityForm.value.url
    }
    this.api.postNewActivity(this.course_id, this.unitNumber, this.lesson_number, newActivity).toPromise()
      .then(() => {
        this.activities.push(newActivity);
        this.closeActivityModal();
        toast('Actividad creada', 3000);
      })
      .catch(err => {
        toast('Error al crear actividad', 3000);
        console.log(err);
      })
  }

}
