import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Unit } from '../../models/units';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {

  public breadcrumb = {
    course: '',
    course_id: ''
  }
  public course_id: string;
  public course_name: string;
  public units: Unit[];


  constructor(
    private route: ActivatedRoute,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.course_id = this.route.snapshot.params['courseId']
    this.course_name = this.route.snapshot.params['course']
    this.breadcrumb = {
      course: this.course_name,
      course_id: this.course_id
    }
    this.api.getAllUnitsByCourseId(this.course_id).subscribe((res: any) => {
      this.units = res.units;
      for(let i=0; i<this.units.length; i++){
        this.api.getAllLessonsByUnitId(this.units[i].unit_id).subscribe((res: any) => {
          this.units[i].lessons = res.lessons
        });
      }
    });
  }

}
