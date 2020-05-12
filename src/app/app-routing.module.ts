import { Routes } from '@angular/router';
// import { Page404Component } from "./pages/page404/page404.component";


export const AppRoutes: Routes = [
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: '404-not-found', component: Page404Component, pathMatch: 'full' },
  { path: '', redirectTo: 'tomar-hora', pathMatch: 'full' },
  { path: '**', redirectTo: '/404-not-found', pathMatch: 'full' }
]