import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {

  public breadcrumb = {
    course: ''
  }

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.breadcrumb = {
      course: this.route.snapshot.params['course']
    }
  }

}
