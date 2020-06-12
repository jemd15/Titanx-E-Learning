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
import { ResolvedTest } from '../models/ResolvedTests';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:3000/api'
  // private apiUrl = 'https://e-learning.titanx.cl/api'

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

  getResolvedTestByCourseId(course_id: string, unit_number: string, lesson_number: string): Observable<ResolvedTest[]> {
    return this.http.get<ResolvedTest[]>(`${this.apiUrl}/course/${course_id}/unit/${unit_number}/lesson/${lesson_number}/resolvedTests`);
  }

  postResolvedTest(email: string, password: string): Observable<User> {
    return this.http.post<User>(this.apiUrl + '/auth/login', { email, password });
  }

  postNewUnit(unit: Unit): Observable<Unit> {
    return this.http.post<Unit>(this.apiUrl + '/course/:course_id/unit/new', {
      number: unit.number,
      title: unit.title,
      description: unit.description,
      state: unit.state,
      course_course_id: unit.course_course_id
    })
  }

  postNewLesson(lesson: Lesson): Observable<Lesson> {
    return this.http.post<Lesson>(this.apiUrl + `/unit/${lesson.unit_unit_id}/lesson/new`, {
      number: lesson.number,
      title: lesson.title,
      unit_unit_id: lesson.unit_unit_id,
      unit_course_course_id: lesson.unit_course_course_id
    })
  }

  postNewActivity(course_id: string, unit_number: string, lesson_number, activity: Activity): Observable<Activity> {
    return this.http.post<Activity>(this.apiUrl + `/course/${course_id}/unit/${unit_number}/lesson/${lesson_number}/activity/new`, {
      number: activity.number, 
      title: activity.title, 
      description: activity.description, 
      type: activity.type, 
      url: activity.url
    })
  }

}

