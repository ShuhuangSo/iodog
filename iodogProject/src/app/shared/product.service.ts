import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';


@Injectable()
export class ProductService {


  // 请求头设置为json格式
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {}

  /**
   * 获取商品列表
   * */
  getProducts(params: string): Observable<any>  {
    return this.http.get(`/api/products/?${params}`);
  }

  /**
   * 获取商品详情by id
   * */
  getProductById(id: number): Observable<any>  {
    return this.http.get(`/api/products/${id}`);
  }

  /**
   * 获取商品详情by sku
   * */
  getProductBySku(params: string): Observable<any>  {
    return this.http.get(`api/base-products/?${params}`);
  }

  /**
   * 获取基础商品列表
   * */
  getBaseProduct(params: string): Observable<any>  {
    return this.http.get(`api/base-products/?${params}`);
  }

  /**
   * 修改商品
   * */
  updateProduct(form: any): Observable<any> {
    return this.http.patch(`/api/products/${form.id}/`, JSON.stringify(form), {observe: 'response'});
  }

  /**
   * 检查sku是否存在
   * */
  checkSKU(params: any): Observable<any> {
    return this.http.post(`api/sku-is-exist-check/`, JSON.stringify(params), {observe: 'response'});
  }

  /**
   * 删除商品
   * */
  deleteProduct(params: string): Observable<any> {
    return this.http.delete(`api/products/${params}/`, {observe: 'response'});
  }

  /**
   * 批量删除商品
   * */
  bulkDeleteProduct(params: any): Observable<any> {
    return this.http.post(`/api/products-bulk/`, JSON.stringify(params), {observe: 'response'});
  }

  /**
   * 批量编辑产品
   * */
  bulkEditProduct(params: any): Observable<any> {
    return this.http.patch(`api/products-bulk/`, JSON.stringify(params), {observe: 'response'});
  }

  /**
   * 模板批量导入产品
   * */
  bulkAddProduct(form: any): Observable<any> {
    return this.http.post('api/import-product/', JSON.stringify(form), {observe: 'response'});
  }

  /**
   * 模板批量导入虚拟sku
   * */
  bulkAddVsku(form: any): Observable<any> {
    return this.http.post('api/import-vsku/', JSON.stringify(form), {observe: 'response'});
  }

  /**
   * 模板批量导入组合
   * */
  bulkAddCombo(form: any): Observable<any> {
    return this.http.post('api/import-combo/', JSON.stringify(form), {observe: 'response'});
  }

  /**
   * 模板批量导入虚拟组合
   * */
  bulkAddVcombo(form: any): Observable<any> {
    return this.http.post('api/import-vcombo/', JSON.stringify(form), {observe: 'response'});
  }

  /**
   * 模板批量导入供应商
   * */
  bulkAddSupplier(form: any): Observable<any> {
    return this.http.post('api/import-supplier/', JSON.stringify(form), {observe: 'response'});
  }

  /**
   * 检查虚拟sku(包含组合虚拟sku)是否存在
   * */
  checkVsku(params: any): Observable<any> {
    return this.http.post(`/api/vsku-check/`, JSON.stringify(params), {observe: 'response'});
  }

  /**
   * 新增注册国家、产品
   * */
  regProduct(form: any): Observable<any> {
    return this.http.post('api/reg-product/', JSON.stringify(form), {observe: 'response'});
  }

  /**
   * 批量新增注册国家、产品
   * */
  regProductBulk(form: any): Observable<any> {
    return this.http.post('api/reg-product-bulk/', JSON.stringify(form), {observe: 'response'});
  }

  /**
   * 获取组合sku列表
   * */
  getCombopacks(params: string): Observable<any> {
    return this.http.get(`api/combopacks/?${params}`);
  }

  /**
   * 修改组合sku
   * */
  updateCombopack(form: any): Observable<any> {
    return this.http.patch(`api/combopacks/${form.id}/`, JSON.stringify(form), {observe: 'response'});
  }

  /**
   * 新增组合sku
   * */
  addCombopack(form: any): Observable<any> {
    return this.http.post('api/combopacks/', JSON.stringify(form), {observe: 'response'});
  }

  /**
   * 删除组合
   * */
  deleteCombopack(params: string): Observable<any> {
    return this.http.delete(`api/combopacks/${params}/`, {observe: 'response'});
  }

  /**
   * 批量删除组合
   * */
  bulkDeleteCombopack(params: any): Observable<any> {
    return this.http.post(`/api/combopacks-bulk/`, JSON.stringify(params), {observe: 'response'});
  }

  /**
   * 批量启用/停用组合
   * */
  bulkChangeCombopackStatus(params: any): Observable<any> {
    return this.http.patch(`/api/combopacks-bulk/`, JSON.stringify(params), {observe: 'response'});
  }

  /**
  * 获取供应商列表
  * */
  getSuppliers(params: string): Observable<any> {
    return this.http.get(`/api/suppliers/?${params}`);
  }


  /**
   * 新增供应商
   * */
  addSupplier(form: any): Observable<any> {
    return this.http.post('/api/suppliers/', JSON.stringify(form), {headers: this.headers, observe: 'response'});
  }

  /**
   * 修改供应商
   * */
  updateSupplier(form: any): Observable<any> {
    return this.http.put(`/api/suppliers/${form.id}/`, JSON.stringify(form), {headers: this.headers, observe: 'response'});
  }

  /**
   * 修改供应商状态
   * */
  changeSupplierStatus(id: number, status: boolean): Observable<any> {
    return this.http.patch(`/api/suppliers/${id}/`, {'status': status}, {headers: this.headers, observe: 'response'});
  }

  /**
   * 删除供应商
   * */
  deleteSupplier(params: string): Observable<any> {
    return this.http.delete(`/api/suppliers/${params}/`, {observe: 'response'});
  }

  /**
   * 批量删除供应商
   * */
  bulkDeleteSupplier(params: any): Observable<any> {
    return this.http.post(`/api/suppliers-bulk/`, JSON.stringify(params), {headers: this.headers, observe: 'response'});
  }

  /**
   * 批量启用/停用供应商
   * */
  bulkChangeSupplierStatus(params: any): Observable<any> {
    return this.http.patch(`/api/suppliers-bulk/`, JSON.stringify(params), {headers: this.headers, observe: 'response'});
  }

  /**
   * 检查供应商名称是否存在
   * */
  checkSupplier(params: any): Observable<any> {
    return this.http.post(`/api/suppliers-check/`, JSON.stringify(params), {headers: this.headers, observe: 'response'});
  }

  /**
   * 新增供应商关联产品
   * */
  addSupplierProduct(form: any): Observable<any> {
    return this.http.post('api/supplier-product/', JSON.stringify(form), {observe: 'response'});
  }

  /**
   * 删除供应商关联产品
   * */
  deleteSupplierProduct(params: string): Observable<any> {
    return this.http.delete(`api/supplier-product/${params}/`, {observe: 'response'});
  }

  /**
   * 批量删除供应商关联产品
   * */
  bulkDeleteSupplierProduct(params: any): Observable<any> {
    return this.http.post(`api/supplier-products-bulk/`, JSON.stringify(params), {observe: 'response'});
  }

  /**
   * 修改供应商关联产品
   * */
  updateSupplierProduct(form: any): Observable<any> {
    return this.http.put(`api/supplier-product/${form.id}/`, JSON.stringify(form), {observe: 'response'});
  }

  /**
   * 获取供应商关联产品列表（通过供应商id）
   * */
  getSupplierProductsBySupplier_id(params: string): Observable<any> {
    return this.http.get(`api/supplier-product-list/?${params}`);
  }

  /**
   * 设置默认供应商
   * */
  setDefaultSupplier(params: any): Observable<any> {
    return this.http.post(`api/set-default-supplier/`, JSON.stringify(params), {observe: 'response'});
  }



}

// 产品
export class Product {

  constructor(
    public id: number, // id
    public sku: string, // 产品sku编码
    public cn_name: string, // 产品中文名称
    public image: string, // 产品图片路径
    public status: string, // 产品状态：ON_SALE, OFFLINE, CLEAN, UNKNOW
    public cost: number, // 产品成本
    public create_time: string, // 创建日期时间
    public en_name: string, // 英文名称
    public length: number, // 长，cm
    public width: number, // 宽，cm
    public heigth: number, // 高，cm
    public weight: number, // 重量，g
    public is_battery: boolean, // 是否带电，默认false
    public is_jack: boolean, // 是否带插座，默认false
    public is_brand: boolean, // 是否有品牌，默认false
    public brand_name: string, // 品牌名称
    public brand_model: string, // 品牌型号
    public declared_value: number, // 申报价值，USD
    public url: string, // 商品URL
    public product_reg_product: RegProduct[],
    public product_sup_product: SupplierProduct[],
    public product_vsku: Vsku[],
    public checked: boolean // 数据选择状态

  ) {

  }
}

export class Vsku {
  constructor(
    public vsku: string
  ) {}
}

// 注册商品信息
export class RegProduct {
  constructor(
    public id: number, // id
    public logistics_company: string, // 物流公司
    public reg_length: number, // 确认长
    public reg_width: number, // 确认宽
    public reg_heigth: number, // 确认高
    public reg_weight: number, // 确认重
    public reg_volume: number, // 确认体积
    public is_active: boolean, // 是否有效
    public reg_product_reg_country: RegCountry[]
  ) {}
}

// 注册国家
export class RegCountry {
  constructor(
    public id: number, // id
    public country_code: string, // 国家编码
    public import_value: number, // 申报价值
    public import_rate: number, // 税率
    public reg_status: string, // 注册状态
  ) {}
}

// 供应商产品
export class SupplierProduct {
  constructor(
    public id: number, // id
    public buy_url: string, // 采购链接
    public primary_supplier: boolean, // 是否默认供应商
    public create_time: string, // 创建时间
    public supplier: string, // 供应商名称
    public sku: string, // 产品sku
    public cn_name: string, // 产品名称
    public checked: boolean // 数据选择状态
  ) {}
}

// 供应商
export class Supplier {
  constructor(
    public id: number,
    public supplier_name: string,
    public buy_way: string,
    public qq: string,
    public phone: string,
    public address: string,
    public note: string,
    public store_url: string,
    public checked: boolean, // 数据选择状态
    public status: boolean
  ) {}
}
// 组合sku
export class Combo {
  constructor(
    public id: number,
    public combo_code: string,
    public combo_name: string,
    public create_time: string,
    public combo_pack_sku: ComboInsideSKU[],
    public combo_pack_vcombo: Vcombo[],
    public combo_status: boolean,
    public cost: number,
    public weight: number,
    public checked: boolean // 数据选择状态
  ) {}
}
// 组合内sku
export class ComboInsideSKU {
  constructor(
    public id: number,
    public sku: string,
    public cn_name: string,
    public quantity: number,
    public product_id: number,
    public image: string,
    public edit: boolean
  ) {}
}
// 虚拟组合sku
export class Vcombo {
  constructor(
    public vsku: string
  ) {}
}
