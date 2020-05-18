import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css']
})
export class LessonComponent implements OnInit {

  public breadcrumb = {
    course: '',
    unit: '',
    lesson: ''
  };

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.breadcrumb = {
      course: this.route.snapshot.params['course'],
      unit: this.route.snapshot.params['unitId'],
      lesson: this.route.snapshot.params['lessonId']
    }
  }

}
