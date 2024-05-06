import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { ItemsComponent } from './items/items.component';
import { AppComponent } from './app.component';
import { ProductComponent } from './product/product.component';
import { AuthGuard } from './AuthGuard/auth.guard';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {
    path: '',
    component: LoginComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
}, 
{
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full',
},
{
    path: 'purchase',
    component: PurchaseComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
},
{
    path: 'product',
    component: ProductComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
},
{
    path: 'item',
    component: ItemsComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
}];