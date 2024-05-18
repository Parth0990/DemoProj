import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { ItemsComponent } from './items/items.component';
import { ProductComponent } from './product/product.component';
import { AuthGuard } from './AuthGuard/auth.guard';
import { VendorComponent } from './vendor/vendor.component';
import { CustomerComponent } from './customer/customer/customer.component';
import { BankComponent } from './bank/bank.component';
import { SalesComponent } from './sales/sales.component';
import { BillComponent } from './bill/bill.component';
import { StockreportComponent } from './stockreport/stockreport.component';

export const routes: Routes = [
    {
    path: '',
    component: LoginComponent,
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
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full'
},
{
    path: 'purchase',
    component: PurchaseComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
},
{
    path: 'item',
    component: ItemsComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
},
{
    path: 'vendor',
    component: VendorComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
},
{
    path: 'customer',
    component: CustomerComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
},

{
    path: 'bank',
    component: BankComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
},
{
    path: 'sales',
    component: SalesComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
},
{
    path: 'bill',
    component: BillComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
},
{
    path: 'stockreport',
    component: StockreportComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
}];