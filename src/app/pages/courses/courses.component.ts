import { Component, OnInit } from '@angular/core';
import { Course } from '../../models/courses';
import { ApiService } from '../../services/api.service';
import { Observable } from 'rxjs';
import { User } from '../../models/user';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  
  public courses: Course[];
  public user: User;

  constructor(
    private api: ApiService
  ) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.api.getAllCourses().subscribe((res: any) =>{
      this.courses = res.courses;
    })
  }

}
