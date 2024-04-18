import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [{
    path: '',
    component: AppComponent,
    pathMatch: 'full'
}, {
    path: '/login',
    component: LoginComponent,
    pathMatch: 'full'
},
{
    path: '/dashboard',
    component: HomeComponent,
    pathMatch: 'full'
}];
