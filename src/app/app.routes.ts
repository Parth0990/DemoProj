import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';

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

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule{}