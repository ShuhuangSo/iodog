import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NgZorroAntdModule, NZ_MESSAGE_CONFIG} from 'ng-zorro-antd';
import { AppComponent } from './app.component';
import {AppRoutingModule} from './app-routing.module';
import { LoginComponent } from './core/login/login.component';
import { RegisterComponent } from './core/register/register.component';
import { HomeComponent } from './core/home/home.component';
import { HeaderComponent } from './core/header/header.component';
import { SidenavComponent } from './core/sidenav/sidenav.component';
import { ProductDetailComponent } from './project/products/product-detail/product-detail.component';
import { DashboardComponent } from './project/dashboard/dashboard.component';
import { AddCountryComponent } from './project/products/add-country/add-country.component';
import { ProductComponent } from './project/products/product/product.component';
import { ProductListComponent } from './project/products/product-list/product-list.component';
import { ProductSearchComponent } from './project/products/product-search/product-search.component';
import {ProductService} from './shared/product.service';
import {JWTInterceptor} from './shared/jwt.interceptor';
import { ProductDisplaySettingComponent } from './project/products/product-display-setting/product-display-setting.component';
import { SupplierComponent } from './project/products/supplier/supplier.component';
import { SupplierProductComponent } from './project/products/supplier-product/supplier-product.component';
import { ListDisplaySettingComponent } from './project/list-display-setting/list-display-setting.component';
import { ComboComponent } from './project/products/combo/combo.component';
import { SupplierAddComponent } from './project/products/supplier-add/supplier-add.component';
import {UsersService} from './shared/users.service';
import { ProductSupplierAddComponent } from './project/products/product-supplier-add/product-supplier-add.component';
import { ProductSupplierEditComponent } from './project/products/product-supplier-edit/product-supplier-edit.component';
import { ComboAddComponent } from './project/products/combo-add/combo-add.component';
import { ComboNewaddComponent } from './project/products/combo-newadd/combo-newadd.component';
import { ProductBulkEditComponent } from './project/products/product-bulk-edit/product-bulk-edit.component';
import { UploadsComponent } from './project/uploads/uploads.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    HeaderComponent,
    SidenavComponent,
    ProductDetailComponent,
    DashboardComponent,
    AddCountryComponent,
    ProductComponent,
    ProductListComponent,
    ProductSearchComponent,
    ProductDisplaySettingComponent,
    SupplierComponent,
    SupplierProductComponent,
    ListDisplaySettingComponent,
    ComboComponent,
    SupplierAddComponent,
    ProductSupplierAddComponent,
    ProductSupplierEditComponent,
    ComboAddComponent,
    ComboNewaddComponent,
    ProductBulkEditComponent,
    UploadsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgZorroAntdModule.forRoot()
  ],
  entryComponents: [
    AddCountryComponent, // 添加注册国家
    ProductDisplaySettingComponent, // 产品列表自定义显示
    ListDisplaySettingComponent, // 自定义显示
    SupplierAddComponent, // 添加、编辑供应商
    SupplierProductComponent, // 供应商产品列表
    ProductDetailComponent, // 商品详情
    ProductSupplierAddComponent, // 商品添加关联供应商
    ProductSupplierEditComponent, // 编辑关联供应商
    ComboAddComponent, // 编辑组合sku
    ComboNewaddComponent, // 添加组合sku
    ProductSearchComponent, // 搜索产品并返回
    ProductBulkEditComponent, // 产品批量编辑
    UploadsComponent // 导入上传
  ],
  providers: [
    ProductService,
    UsersService,
    [{ provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true }]
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
