import { MaterializeModule } from 'angular2-materialize';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutes } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './auth/auth.interceptor';

// cambiando LOCALE_ID a español
import { LOCALE_ID } from '@angular/core';
import es from '@angular/common/locales/es'
import { registerLocaleData } from '@angular/common'
registerLocaleData(es)

import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { SafeUrlPipe } from './pipes/safe-url/safe-url.pipe';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SearchPipe } from './pipes/search/search.pipe';
import { ExcelService } from './services/excel.service';

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
import { UsersComponent } from './pages/users/users.component';
import { StudentsComponent } from './pages/students/students.component';
import { SchoolsComponent } from './pages/schools/schools.component';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';
import { AccountComponent } from './pages/account/account.component';
import { TestListComponent } from './pages/test-list/test-list.component';


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
    SearchPipe,
    StudentsComponent,
    SchoolsComponent,
    VerifyEmailComponent,
    AccountComponent,
    TestListComponent
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
    { 
      provide: LOCALE_ID,
      useValue: "es-ES"
    },
    ApiService,
    AuthService,
    ExcelService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
