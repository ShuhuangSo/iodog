import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';


@Injectable()
export class ProductService {

  private products: Product[] = [
    new Product(
      123,
      'N332BK',
      '平纹真皮 三星A8 2018【黑色】',
      '/image/123.jpg',
      'ON_SALE',
      11,
      '2018-05-23 21:59:59',
      'phone case',
      20,
      10,
      0.9,
      55,
      false,
      false,
      false,
      'no-brand',
      'no-model',
      0.3,
      'www.1688.com/itm/12312371974',
      false
    ),
    new Product(
      124,
      'N334BK',
      '平纹真皮 三星A9 2019【黑色】',
      '/image/124.jpg',
      'OFFLINE',
      13,
      '2018-05-24 21:59:59',
      'phone case',
      20,
      10,
      0.9,
      55,
      false,
      false,
      false,
      'no-brand',
      'no-model',
      0.3,
      'www.1688.com/itm/12312371975',
      false
    ),
    new Product(
      125,
      'N534BK',
      '平纹真皮 三星A9 2019【黑色】',
      '/image/124.jpg',
      'CLEAN',
      13,
      '2018-05-24 21:59:59',
      'phone case',
      20,
      10,
      0.9,
      55,
      false,
      false,
      false,
      'no-brand',
      'no-model',
      0.3,
      'www.1688.com/itm/12312371975',
      false
    ),
    new Product(
      126,
      'N534BK',
      '平纹真皮 三星A9 2019【黑色】',
      '/image/124.jpg',
      'UNKNOW',
      13,
      '2018-05-24 21:59:59',
      'phone case',
      20,
      10,
      0.9,
      55,
      false,
      false,
      false,
      'no-brand',
      'no-model',
      0.3,
      'www.1688.com/itm/12312371975',
      false
    ),
    new Product(
      127,
      'N332BK',
      '平纹真皮 三星A8 2018【黑色】',
      '/image/123.jpg',
      'ON_SALE',
      11,
      '2018-05-23 21:59:59',
      'phone case',
      20,
      10,
      0.9,
      55,
      false,
      false,
      false,
      'no-brand',
      'no-model',
      0.3,
      'www.1688.com/itm/12312371974',
      false
    ),
    new Product(
      128,
      'N334BK',
      '平纹真皮 三星A9 2019【黑色】',
      '/image/124.jpg',
      'OFFLINE',
      13,
      '2018-05-24 21:59:59',
      'phone case',
      20,
      10,
      0.9,
      55,
      false,
      false,
      false,
      'no-brand',
      'no-model',
      0.3,
      'www.1688.com/itm/12312371975',
      false
    ),
    new Product(
      129,
      'N534BK',
      '平纹真皮 三星A9 2019【黑色】',
      '/image/124.jpg',
      'CLEAN',
      13,
      '2018-05-24 21:59:59',
      'phone case',
      20,
      10,
      0.9,
      55,
      false,
      false,
      false,
      'no-brand',
      'no-model',
      0.3,
      'www.1688.com/itm/12312371975',
      false
    ),
    new Product(
      130,
      'N534BK',
      '平纹真皮平纹真皮平纹真皮 三星A9 2019【黑色】',
      '/image/124.jpg',
      'UNKNOW',
      13,
      '2018-05-24 21:59:59',
      'phone case',
      20,
      10,
      0.9,
      55,
      false,
      false,
      false,
      'no-brand',
      'no-model',
      0.3,
      'www.1688.com/itm/12312371975',
      false
    )
  ]



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


  // 获取商品列表
  getProducts() {
    return this.products;
  }

  /**
  * 获取供应商列表
  * */
  getSuppliers(params: string): Observable<any> {
    return this.http.get('/api/suppliers' + params);
  }

  /**
   * 新增供应商
   * */
  addSupplier(form: any): Observable<any> {
    return this.http.post('/api/suppliers/', JSON.stringify(form), {headers: this.headers});
  }

  /**
   * 修改供应商
   * */
  updateSupplier(form: any): Observable<any> {
    return this.http.put(`/api/suppliers/${form.id}/`, JSON.stringify(form), {headers: this.headers});
  }

  /**
   * 删除供应商
   * */
  deleteSupplier(params: string): Observable<any> {
    return this.http.delete(`/api/suppliers/${params}/`);
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
    public checked: boolean // 数据选择状态

  ) {

  }
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
