import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css']
})
export class LessonComponent implements OnInit {

  private breadcrumb = {};

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    /* this.breadcrumb = {
      course: this.route.snapshot.paramMap.get('course'),
      unit: this.route.snapshot.paramMap.get('unitId'),
      lesson: this.route.snapshot.paramMap.get('lessonId')
    } */
  }

}
