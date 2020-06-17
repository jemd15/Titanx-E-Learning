import { MaterializeModule } from 'angular2-materialize';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutes } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './auth/auth.interceptor';

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
import { ApiService } from './services/api.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { SafeUrlPipe } from './pipes/safe-url/safe-url.pipe';
import { UsersComponent } from './pages/users/users.component';
import { SearchPipe } from './pipes/search/search.pipe';


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
    RestorePassComponent,
    SafeUrlPipe,
    UsersComponent,
    SearchPipe
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    MaterializeModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(AppRoutes, { useHash: true, scrollPositionRestoration: 'enabled' })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi:true,
    },
    ApiService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
