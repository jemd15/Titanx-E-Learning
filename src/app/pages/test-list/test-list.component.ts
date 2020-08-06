import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Course } from '../../models/courses';
import { Unit } from '../../models/units';
import { Lesson } from '../../models/lessons';
import { EventEmitter } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-test-list',
  templateUrl: './test-list.component.html',
  styleUrls: ['./test-list.component.css']
})
export class TestListComponent implements OnInit {

  public filter: string = '';
  public tests = [];
  public courses: Course[];
  public units: Unit[];
  public lessons: Lesson[];
  public download_units: Unit[];
  public download_lessons: Lesson[];
  public pages = [];
  public actualPage: number;
  public lastPage: number;
  public nextPage: number;
  public modalNewTest = new EventEmitter<string | MaterializeAction>();
  public modalDetailTestResolved = new EventEmitter<string | MaterializeAction>();
  public newTestForm: FormGroup;
  public testSearchForm: FormGroup;
  public downloadTestsForm: FormGroup;
  public filtered: boolean = false;
  public detailTest;

  constructor(
    public formBuilder: FormBuilder,
    private api: ApiService,
  ) { }

  ngOnInit(): void {
    this.newTestForm = this.createNewTestForm();
    this.testSearchForm = this.createTestSearchForm();
    this.downloadTestsForm = this.createDownloadTestsForm();
    this.chargePage(1);
    this.api.getAllCourses().toPromise()
      .then((res: any) => {
        this.courses = res.courses;
      })
  }

  private createNewTestForm() {
    return this.formBuilder.group({
      name: ['', Validators.required],
      img_url: ['', Validators.required]
    })
  }

  private createTestSearchForm() {
    return this.formBuilder.group({
      course: ['', Validators.required],
      unit: [''],
      lesson: ['']
    })
  }

  private createDownloadTestsForm() {
    return this.formBuilder.group({
      course: ['', Validators.required],
      unit: [''],
      lesson: ['']
    })
  }

  openCreateTestModal() {
    this.modalNewTest.emit({ action: 'modal', params: ['open'] });
  }

  closeCreateTestModal() {
    this.modalNewTest.emit({ action: 'modal', params: ['close'] });
    this.newTestForm.reset();
  }

  openDetailTestResolvedModal(test) {
    this.detailTest = test;
    this.modalDetailTestResolved.emit({ action: 'modal', params: ['open'] });
  }

  closeDetailTestResolvedModal() {
    this.modalDetailTestResolved.emit({ action: 'modal', params: ['close'] });
  }

  searchTest() {
    this.filtered = true;
    this.chargePage(1);
  }

  resetFilters() {
    this.filtered = false;
    this.testSearchForm.reset();
    this.chargePage(this.actualPage);
  }

  chargePage(page: number) {
    this.actualPage = page;
    if (this.filtered == false) {
      this.api.getResolvedTest(page).subscribe((res: any) => {
        this.tests = res.resolvedTests;
        this.pages = [];
        const pagesOnPagination: number = (res.pages < 4) ? res.pages : 4;
        this.lastPage = (page == 1) ? 1 : page - 1;
        this.nextPage = (page != res.pages) ? page + 1 : page;

        switch (page) {
          case 1:
          case 2:
          case 3:
            for (let i = 0; i < pagesOnPagination; i++) {
              this.pages.push({
                number: i + 1,
                state: ((i + 1) == page) ? 'active' : ''
              });
            }
            break
          default:
            let untilAux = (page == res.pages) ? res.pages : page + 1;
            for (let i = page - 3; i < untilAux; i++) {
              this.pages.push({
                number: i + 1,
                state: ((i + 1) == page) ? 'active' : ''
              });
            }
            if (page == res.pages) {
              this.pages.unshift({
                number: page - 3,
                state: ''
              });
            }
            break
        }
      });
    } else {
      this.api.searchResolvedTest(page, this.testSearchForm.controls['course'].value, this.testSearchForm.controls['unit'].value, this.testSearchForm.controls['lesson'].value).subscribe((res: any) => {
        this.tests = res.resolvedTests;
        this.pages = [];
        const pagesOnPagination: number = (res.pages < 4) ? res.pages : 4;
        this.lastPage = (page == 1) ? 1 : page - 1;
        this.nextPage = (page != res.pages) ? page + 1 : page;

        switch (page) {
          case 1:
          case 2:
          case 3:
            for (let i = 0; i < pagesOnPagination; i++) {
              this.pages.push({
                number: i + 1,
                state: ((i + 1) == page) ? 'active' : ''
              });
            }
            break
          default:
            let untilAux = (page == res.pages) ? res.pages : page + 1;
            for (let i = page - 3; i < untilAux; i++) {
              this.pages.push({
                number: i + 1,
                state: ((i + 1) == page) ? 'active' : ''
              });
            }
            if (page == res.pages) {
              this.pages.unshift({
                number: page - 3,
                state: ''
              });
            }
            break
        }
      });
    }
  }

  async getUnitsByCourse() {
    this.testSearchForm.controls['unit'].reset();
    this.testSearchForm.controls['lesson'].reset();
    if (this.testSearchForm.value.course !== '') {
      let course_id: string;
      for await (const course of this.courses) {
        if (course.course == this.testSearchForm.value.course) {
          course_id = course.course_id.toString();
          this.api.getAllUnitsByCourseId(course_id).toPromise()
            .then((res: any) => {
              this.units = res.units;
            })
            .catch(err => {
              console.log(err);
            });
          break;
        }
      }
    }
  }

  async getLessonsByUnit() {
    this.testSearchForm.controls['lesson'].reset();
    if (this.testSearchForm.controls['unit'].value !== '') {
      let unit_id: string;
      for await (const unit of this.units) {
        if (unit.title == this.testSearchForm.value.unit) {
          unit_id = unit.unit_id.toString();
          this.api.getAllLessonsByUnitId(unit_id).toPromise()
            .then((res: any) => {
              this.lessons = res.lessons;
            })
            .catch(err => {
              console.log(err);
            });
          break;
        }
      }
    }
  }

  async getUnitsByCourseOnDownload() {
    this.downloadTestsForm.controls['unit'].reset();
    this.downloadTestsForm.controls['lesson'].reset();
    if (this.downloadTestsForm.value.course !== '') {
      let course_id: string;
      for await (const course of this.courses) {
        if (course.course == this.downloadTestsForm.value.course) {
          course_id = course.course_id.toString();
          this.api.getAllUnitsByCourseId(course_id).toPromise()
            .then((res: any) => {
              this.download_units = res.units;
            })
            .catch(err => {
              console.log(err);
            });
          break;
        }
      }
    }
  }

  async getLessonsByUnitOnDownload() {
    this.downloadTestsForm.controls['lesson'].reset();
    if (this.downloadTestsForm.controls['unit'].value !== '') {
      let unit_id: string;
      for await (const unit of this.download_units) {
        if (unit.title == this.downloadTestsForm.value.unit) {
          unit_id = unit.unit_id.toString();
          this.api.getAllLessonsByUnitId(unit_id).toPromise()
            .then((res: any) => {
              this.download_lessons = res.lessons;
            })
            .catch(err => {
              console.log(err);
            });
          break;
        }
      }
    }
  }

  downloadTest() {
    console.log('download:',this.downloadTestsForm.controls['course'].value, ',', this.downloadTestsForm.controls['unit'].value, ',', this.downloadTestsForm.controls['lesson'].value);
    this.api.downloadResolvedTest(this.downloadTestsForm.controls['course'].value, this.downloadTestsForm.controls['unit'].value, this.downloadTestsForm.controls['lesson'].value).toPromise()
      .then((res: any) => {
        console.table(res.resolvedTests);
      })
  }
}
