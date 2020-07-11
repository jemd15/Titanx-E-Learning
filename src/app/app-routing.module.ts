import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { Page404Component } from './pages/page404/page404.component';
import { HomeComponent } from './pages/home/home.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { CourseDetailComponent } from './pages/course-detail/course-detail.component';
import { LessonComponent } from './pages/lesson/lesson.component';
import { RestorePassComponent } from './pages/restore-pass/restore-pass.component';
import { UsersComponent } from './pages/users/users.component';
import { StudentsComponent } from './pages/students/students.component';
import { SchoolsComponent } from './pages/schools/schools.component';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';

export const AppRoutes: Routes = [
  { path: 'home', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: 'restore-pass/:token', component: RestorePassComponent, pathMatch: 'full' },
  { path: 'courses', component: CoursesComponent, pathMatch: 'full' },
  { path: 'users', component: UsersComponent, pathMatch: 'full' },
  { path: 'students', component: StudentsComponent, pathMatch: 'full' },
  { path: 'schools', component: SchoolsComponent, pathMatch: 'full' },
  { path: 'verify-email/:token', component: VerifyEmailComponent, pathMatch: 'full' },
  { path: 'courses/:courseId/:course', component: CourseDetailComponent, pathMatch: 'full' },
  { path: 'courses/:courseId/:course/unit/:unitNumber/lesson/:lessonNumber', component: LessonComponent, pathMatch: 'full' },
  { path: '404-not-found', component: Page404Component, pathMatch: 'full' },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: '/404-not-found', pathMatch: 'full' }
]