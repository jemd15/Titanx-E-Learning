import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Activity } from '../../models/activities';
import { Question } from '../../models/questions';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms'
import { User } from '../../models/user';
import { EventEmitter } from '@angular/core';
import { MaterializeAction, toast } from 'angular2-materialize';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css']
})
export class LessonComponent implements OnInit {

  public user: User;
  public breadcrumb = {
    course: '',
    course_id: '',
    unit: '',
    lesson_number: ''
  };
  public course: string;
  public course_id: string;
  public unitNumber: string;
  public lesson_number: string;
  private test_id: string;
  public activities: Activity[] = [];
  public questions: Question[] = [];
  public testForm: FormGroup;
  public newActivityForm: FormGroup;
  public modalNewActivity = new EventEmitter<string | MaterializeAction>();

  constructor(
    private route: ActivatedRoute,
    public formBuilder: FormBuilder,
    private api: ApiService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.user = this.auth.userData();
    console.log(this.user);
    
    this.testForm = this.createTestForm();
    this.newActivityForm = this.createNewActivityForm();
    this.course = this.route.snapshot.params['course'],
      this.course_id = this.route.snapshot.params['courseId'],
      this.unitNumber = this.route.snapshot.params['unitNumber'],
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
    this.api.getTestByCourseId(this.course_id, this.unitNumber, this.lesson_number).toPromise()
      .then((res: any) => {
        if (res.test.length > 0) {
          this.test_id = res.test[0].test_id;
          this.api.getQuestionsByTestId(this.test_id).toPromise()
            .then((res: any) => {
              this.questions = res.questions;
              this.questions.forEach(question => {
                this.api.getAnswersByQuestionId(question.question_id).toPromise()
                  .then((res: any) => {
                    if (res.answers[0]) {
                      this.addQuestionAndAnswers(question.type, question.title, res.answers[0].title, res.answers[1].title, res.answers[2].title, res.answers[3].title); // preguntas con alternativas
                    } else {
                      this.addQuestionAndAnswers(question.type, question.title); // preguntas de desarrollo
                    }
                  })
                  .catch(err => {
                    console.log('error', err);
                  });
              });
            })
            .catch(err => {
              console.log('error', err);
            });
        }
      })
      .catch(err => {
        console.log('error', err);
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

  private createTestForm() {
    return this.formBuilder.group({
      test: this.formBuilder.array([])
    });
  }

  get test(): FormArray {
    return this.testForm.get('test') as FormArray;
  }

  private addQuestionAndAnswers(type: string, title: string, answer_1?: string, answer_2?: string, answer_3?: string, answer_4?: string) {
    const testFormGroup = this.formBuilder.group({
      student_id: this.user.student_id,
      test_id: this.test_id,
      type,
      title,
      answer_1,
      answer_2,
      answer_3,
      answer_4,
      response: ['']
    });

    this.test.push(testFormGroup);
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
    
    let testUrl: string;
    if (newActivity.type === 'video' && (this.newActivityForm.value.url.search('www.youtube.com/watch') !== -1)) {
      testUrl = this.newActivityForm.value.url.split('=')[1];
      this.newActivityForm.value.url = `https://www.youtube.com/embed/${testUrl}`;
    } else if (newActivity.type === 'video' && (this.newActivityForm.value.url.search('youtu.be') !== -1)) {
      testUrl = this.newActivityForm.value.url.split('/')[3];
      this.newActivityForm.value.url = `https://www.youtube.com/embed/${testUrl}`;
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
      });
  }

  responseTest() {
    if (this.user.rol === 'student') {
      for (let element of this.testForm.value.test) {
        if (element.response === '') {
          let permissionToContinue = confirm('Falta responder alguna(s) pregunta(s).\n ¿Deseas continuar de todas formas?');
          if (permissionToContinue) {
            console.log('puso ok')
            this.api.responseTest(this.testForm.value.test).toPromise()
            .then(() => {
              toast('Test enviado correctamente.', 1500);
            })
            .catch(err => {
              console.log({ err });
            })
          }
          break;
        } else {
          this.api.responseTest(this.testForm.value.test).toPromise()
            .then(() => {
              toast('Test enviado correctamente.', 1500);
            })
            .catch(err => {
              console.log(err.error.message);
              if (err.error.message === 'You cannot responce the tests twice.') {
                toast('El test no puede responderse más de una vez', 3000);
              }
            });
          break;
        }
      }
    } else {
      toast('Usted no tiene permitido responder este test', 3000);
    }

  }

  setSimpleResponse(testIndex: number, value: string) {
    this.testForm.value.test[testIndex].response = value
  }

  setMultipleResponse(testIndex: number, value: string) {
    if (this.testForm.value.test[testIndex].response.search(value) !== -1) {
      this.testForm.value.test[testIndex].response = this.testForm.value.test[testIndex].response.replace(value + ';;;', '') || this.testForm.value.test[testIndex].response.replace(';;;' + value, '');
    } else {
      if (this.testForm.value.test[testIndex].response.search(';;;') !== -1 || this.testForm.value.test[testIndex].response !== '') {
        this.testForm.value.test[testIndex].response += ';;;' + value;
      } else {
        this.testForm.value.test[testIndex].response = value;
      }
    }
  }

}
