import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { ItemsComponent } from './items/items.component';
import { AppComponent } from './app.component';
import { ProductComponent } from './product/product.component';

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
    component: AppComponent,
    pathMatch: 'full'
},
{
    path: 'purchase',
    component: PurchaseComponent,
    pathMatch: 'full'
},
{
    path: 'product',
    component: ProductComponent,
    pathMatch: 'full'
},
{
    path: 'item',
    component: ItemsComponent,
    pathMatch: 'full'
}];