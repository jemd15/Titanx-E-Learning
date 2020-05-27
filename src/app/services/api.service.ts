import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:3000'

  constructor(
    private http: HttpClient
  ) {

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

  getAllCourses(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl + '/courses');
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(this.apiUrl + '/auth/login', { email, password });
  }

}