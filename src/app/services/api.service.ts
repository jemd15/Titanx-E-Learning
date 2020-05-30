import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from "../models/user";
import { Course } from '../models/courses';
import { Unit } from '../models/units';
import { Activity } from '../models/activities';
import { Lesson } from '../models/lessons';
import { Test } from '../models/tests';
import { Question } from '../models/questions';
import { Answer } from '../models/answers';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // private apiUrl = 'http://localhost:3000/api'
  private apiUrl = 'https://e-learning.titanx.cl/api'

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
    return this.http.get<Course[]>(this.apiUrl + '/courses');
  }

  getAllUnitsByCourseId(course_id: string): Observable<Unit[]> {
    return this.http.get<Unit[]>(`${this.apiUrl}/course/${course_id}/units`);
  }

  getAllLessonsByUnitId(unit_id: string): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.apiUrl}/unit/${unit_id}/lessons`);
  }

  getAllActivities(course_id: string, unit_number: string, lesson_number: string): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}/course/${course_id}/unit/${unit_number}/lesson/${lesson_number}/activities`);
  }

  getTestByCourseId(course_id: string, unit_number: string, lesson_number: string): Observable<Test> {
    return this.http.get<Test>(`${this.apiUrl}/course/${course_id}/unit/${unit_number}/lesson/${lesson_number}/test`);
  }

  getQuestionsByTestId(test_id: string): Observable<Question> {
    return this.http.get<Question>(`${this.apiUrl}/test/${test_id}/questions`);
  }

  getAnswersByQuestionId(question_id: string): Observable<Answer> {
    return this.http.get<Answer>(`${this.apiUrl}/question/${question_id}/answers`);
  }

}