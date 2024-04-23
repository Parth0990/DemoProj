import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { ItemsComponent } from './items/items.component';

export const routes: Routes = [
    {
    path: '',
    component: LoginComponent,
    pathMatch: 'full'
}, 
{
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full'
},
{
    path: 'home',
    component: HomeComponent,
    pathMatch: 'full'
},
{
    path: 'purchase',
    component: PurchaseComponent,
    pathMatch: 'full'
},
{
    path: 'item',
    component: ItemsComponent,
    pathMatch: 'full'
}];