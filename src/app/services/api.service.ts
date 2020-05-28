import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from "../models/user";
import { Course } from '../models/courses';
import { Unit } from '../models/units';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:3000'

  constructor(
    private http: HttpClient
  ) {

  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(this.apiUrl + '/auth/login', { email, password });
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl + '/users');
  }

  getAllTeachers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl + '/users/teachers');
  }

  getAllStudents(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl + '/users/students');
  }

  getAllAdmins(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl + '/users/admins');
  }

  getAllCourses(): Observable<Course[]> {
    return this.http.get<User[]>(this.apiUrl + '/courses');
  }

  getAllUnitsByCourseId(course_id: string): Observable<Unit[]> {
    return this.http.get<Unit[]>(`${this.apiUrl}/course/${course_id}/units`);
  }

  getAllLessonsByUnitId(unit_id: string): Observable<Unit[]> {
    return this.http.get<Unit[]>(`${this.apiUrl}/unit/${unit_id}/lessons`);
  }

  getAllActivities(course_id: string, unit_number: string, lesson_number: string): Observable<Unit[]> {
    return this.http.get<Unit[]>(`${this.apiUrl}/course/${course_id}/unit/${unit_number}/lesson/${lesson_number}/activities`);
  }

}