import { Component, OnInit } from '@angular/core';
import { Course } from '../../models/courses';
import { ApiService } from '../../services/api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  
  public courses: Course[];

  constructor(
    private api: ApiService
  ) { }

  ngOnInit() {
    this.api.getAllCourses().subscribe((res: any) =>{
      this.courses = res.courses;
      console.log(this.courses)
    })
  }

}
