import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {LoginComponent} from './core/login/login.component';
import {RegisterComponent} from './core/register/register.component';
import {HomeComponent} from './core/home/home.component';
import {ProductDetailComponent} from './project/products/product-detail/product-detail.component';
import {DashboardComponent} from './project/dashboard/dashboard.component';
import {ProductComponent} from './project/products/product/product.component';
import {SupplierComponent} from './project/products/supplier/supplier.component';
import {ComboComponent} from './project/products/combo/combo.component';
import {PlatformAuthComponent} from './project/settings/platform-auth/platform-auth.component';


const routes: Routes = [
  {
    path: '', redirectTo: 'home', pathMatch: 'full'
  },
  {
    path: 'home', component: HomeComponent,
    children: [
      {path: '', component: DashboardComponent},
      {path: 'product/:id', component: ProductDetailComponent},
      {path: 'product', component: ProductComponent},
      {path: 'supplier', component: SupplierComponent},
      {path: 'combo', component: ComboComponent},
      {path: 'platform-auth', component: PlatformAuthComponent}
    ]
  },
  {
    path: 'login', component: LoginComponent,
  },
  {
    path: 'register', component: RegisterComponent,
  }
];

@NgModule(
  {
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
  }
)

export class AppRoutingModule {}
