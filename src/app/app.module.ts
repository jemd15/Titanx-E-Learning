import { MaterializeModule } from 'angular2-materialize';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AppRoutes } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { Page404Component } from './pages/page404/page404.component';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { CourseDetailComponent } from './pages/course-detail/course-detail.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { LessonComponent } from './pages/lesson/lesson.component';
import { RestorePassComponent } from './pages/restore-pass/restore-pass.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    Page404Component,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    CoursesComponent,
    CourseDetailComponent,
    BreadcrumbComponent,
    LessonComponent,
    RestorePassComponent
  ],
  imports: [
    BrowserModule,
    MaterializeModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    RouterModule.forRoot(AppRoutes, { useHash: true })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
