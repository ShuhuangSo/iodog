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
import {WarehouseListComponent} from './project/warehouse/warehouse-list/warehouse-list.component';
import {WarehouseSettingsComponent} from './project/warehouse/warehouse-settings/warehouse-settings.component';
import {RefillPromoteComponent} from './project/purchase/refill-promote/refill-promote.component';


const routes: Routes = [
  {
    path: '', redirectTo: 'home', pathMatch: 'full'
  },
  {
    path: 'home', component: HomeComponent,
    children: [
      {path: '', component: DashboardComponent}, // 主页面
      {path: 'product/:id', component: ProductDetailComponent}, // 产品详情
      {path: 'product', component: ProductComponent}, // 产品列表
      {path: 'supplier', component: SupplierComponent}, // 供应商
      {path: 'combo', component: ComboComponent}, // 产品组合
      {path: 'warehouse', component: WarehouseListComponent}, // 仓库列表
      {path: 'warehouse-settings', component: WarehouseSettingsComponent}, // 仓库设置
      {path: 'auto-promote', component: RefillPromoteComponent}, // 补货推荐
      {path: 'platform-auth', component: PlatformAuthComponent} // 平台授权
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
