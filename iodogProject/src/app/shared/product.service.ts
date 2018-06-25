import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';


@Injectable()
export class ProductService {

  private combo: Combo [] = [
    new Combo(
      1,
      'N223BK-S2',
      '三星S9+钢化膜',
      '2018-5-31 21:59:59',
      [
        new ComboInsideSKU(
          'N123BK',
          '平纹真皮左右 三星S9 【黑色】',
          1,
          '/image/113.jpg'
        ),
        new ComboInsideSKU(
          'N125CR',
          '钢化膜 三星S9 【透明】',
          2,
          '/image/115.jpg'
        )
      ],
      false,
      false
      ),
    new Combo(
      2,
      'N224BK-S1',
      '三星S7+钢化膜',
      '2017-5-31 21:59:59',
      [
        new ComboInsideSKU(
          'N222BK',
          '平纹真皮左右 三星S9 【黑色】',
          1,
          '/image/113.jpg'
        ),
        new ComboInsideSKU(
          'N223CR',
          '钢化膜 三星S9 【透明】',
          2,
          '/image/115.jpg'
        ),
        new ComboInsideSKU(
          'N224CR',
          '钢化膜 三星S9 【透明】',
          3,
          '/image/115.jpg'
        )
      ],
      true,
      false
    )
  ];

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

  // 获取组合商品列表
  getCombo() {
    return this.combo;
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
    public checked: boolean // 数据选择状态

  ) {

  }
}

// 注册商品信息
export class RegProduct {
  constructor(
    public id: number, // id
    public logistics_company: string, // 物流公司
    public reg_length: number, // 确认长
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
    public reg_status: boolean, // 注册状态
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
    public skus: ComboInsideSKU[],
    public status: boolean,
    public checked: boolean // 数据选择状态
  ) {}
}
// 组合内sku
export class ComboInsideSKU {
  constructor(
    public sku: string,
    public name: string,
    public quanlity: number,
    public image: string
  ) {}
}
