import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {

  private breadcrumb = {}

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    /* this.breadcrumb = {
      course: this.route.snapshot.paramMap.get('course')
    } */
  }

}
