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
import { School } from '../models/schools';

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
    return this.http.post<User>(this.apiUrl + '/auth/login', { email, password })
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl + '/users')
  }

  getUsersWithPagination(page: number, limit: number): Observable<User[]> {
    return this.http.post<User[]>(this.apiUrl + '/users', { page, limit })
  }

  getAllTeachers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl + '/users/teachers')
  }

  getAllStudents(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl + '/users/students')
  }

  getAllAdmins(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl + '/users/admins')
  }

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl + '/courses')
  }

  getAllUnitsByCourseId(course_id: string): Observable<Unit[]> {
    return this.http.get<Unit[]>(`${this.apiUrl}/course/${course_id}/units`)
  }

  getAllLessonsByUnitId(unit_id: string): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.apiUrl}/unit/${unit_id}/lessons`)
  }

  getAllActivities(course_id: string, unit_number: string, lesson_number: string): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}/course/${course_id}/unit/${unit_number}/lesson/${lesson_number}/activities`)
  }

  getTestByCourseId(course_id: string, unit_number: string, lesson_number: string): Observable<Test> {
    return this.http.get<Test>(`${this.apiUrl}/course/${course_id}/unit/${unit_number}/lesson/${lesson_number}/test`)
  }

  getQuestionsByTestId(test_id: string): Observable<Question> {
    return this.http.get<Question>(`${this.apiUrl}/test/${test_id}/questions`)
  }

  getAnswersByQuestionId(question_id: string): Observable<Answer> {
    return this.http.get<Answer>(`${this.apiUrl}/question/${question_id}/answers`)
  }

  getResolvedTestByCourseId(course_id: number): Observable<ResolvedTest[]> {
    return this.http.get<ResolvedTest[]>(`${this.apiUrl}/course/${course_id}/resolvedTests`)
  }

  getResolvedTest(page: number): Observable<ResolvedTest[]> {
    return this.http.get<ResolvedTest[]>(`${this.apiUrl}/courses/resolvedTests/page/${page}`)
  }

  searchResolvedTest(page: number, course: string, unit: string, lesson: string): Observable<ResolvedTest[]> {
    return this.http.post<ResolvedTest[]>(`${this.apiUrl}/courses/searchResolvedTests/page/${page}`, { course, unit, lesson })
  }

  downloadResolvedTest(course: string, unit: string, lesson: string): Observable<ResolvedTest[]> {
    return this.http.post<ResolvedTest[]>(`${this.apiUrl}/courses/searchResolvedTests/`, { course, unit, lesson })
  }

  postResolvedTest(email: string, password: string): Observable<User> {
    return this.http.post<User>(this.apiUrl + '/auth/login', { email, password })
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

  postNewCourse(course: Course): Observable<Course> {
    console.log(course);
    return this.http.post<Course>(this.apiUrl + `/course/new`, {
      school_id: course.school_id,
      name: course.course,
      img_url: course.img_url,
      teacher_teacher_id: course.teacher_teacher_id
    })
  }

  getStudentsBySchoolId(school_id: string): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl + `/users/school/${school_id}`)
  }

  getStudentsByCourseId(course_id: string): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl + `/users/course/${course_id}`)
  }

  asignStudentToCourse(course_id, student_id, school_id): Observable<any> {
    return this.http.post<any>(this.apiUrl + `/course/add-student`, { course_id, student_id, school_id })
  }

  removeStudentToCourse(course_id, student_id): Observable<any> {
    return this.http.delete<any>(this.apiUrl + `/course/${course_id}/student/${student_id}/remove-student`)
  }

  getAllSchools(): Observable<School[]> {
    return this.http.get<School[]>(this.apiUrl + `/schools`)
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl + `/users/new`, user)
  }

  createSchool(school: School): Observable<School> {
    return this.http.post<School>(this.apiUrl + `/schools/new`, school)
  }

  changeState(userChanges): Observable<any> {
    return this.http.put<any>(this.apiUrl + `/users/change-state`, userChanges)
  }

  verifyEmail(token: string): Observable<any> {
    return this.http.post<any>(this.apiUrl + `/users/verify-email`, { token })
  }

  updateUser(user_id: number, name: string, lastName: string, newEmail: string, email: string): Observable<any> {
    return this.http.put<any>(this.apiUrl + `/users/update/`, { name, lastName, newEmail, email, user_id })
  }

  changePassUser(user_id: number, password: string, newPassword: string, email: string): Observable<any> {
    return this.http.put<any>(this.apiUrl + `/users/change-pass`, { user_id, password, newPassword, email })
  }

  responseTest(test): Observable<any> {
    return this.http.post<any>(this.apiUrl + `/courses/resolved_test/new`, { test })
  }

}

