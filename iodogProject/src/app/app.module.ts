import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule } from 'ng-zorro-antd';
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
import { ProductDisplaySettingComponent } from './project/products/product-display-setting/product-display-setting.component';
import { SupplierComponent } from './project/products/supplier/supplier.component';
import { SupplierProductComponent } from './project/products/supplier-product/supplier-product.component';
import { ListDisplaySettingComponent } from './project/list-display-setting/list-display-setting.component';

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
    ListDisplaySettingComponent
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
    AddCountryComponent,
    ProductDisplaySettingComponent,
    ListDisplaySettingComponent],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
