import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class WarehouseService {
  wh_stock = [new WHStock(
    1,
    'N123BK',
    '平纹真皮手机套',
    '',
    100,
    80,
    20,
    50,
    500,
    480,
    '45.6',
    '48.5',
    '24.5',
    true,
    false,
    false,
    ''
  )];

  constructor(private http: HttpClient) { }

  getWHStock() {
    return this.wh_stock;
  }

  /**
   * 获取初始设置仓库
   * */
  getSettingWarehouse(params: string): Observable<any>  {
    return this.http.get(`api/third-warehouse/?${params}`);
  }

  /**
   * 添加仓库
   * */
  addWarehouse(params: any): Observable<any> {
    return this.http.post(`api/third-warehouse/`, JSON.stringify(params), {observe: 'response'});
  }

  /**
   * 获取仓库列表
   * */
  getWarehouse(params: string): Observable<any>  {
    return this.http.get(`api/warehouse-setting/?${params}`);
  }

  /**
   * 修改仓库状态
   * */
  updateWarehouse(form: any): Observable<any> {
    return this.http.patch(`api/warehouse-setting/${form.id}/`, JSON.stringify(form), {observe: 'response'});
  }

  /**
   * 添加本地仓库
   * */
  addLocalWarehouse(params: any): Observable<any> {
    return this.http.post(`api/warehouse-add-local/`, JSON.stringify(params), {observe: 'response'});
  }

  /**
   * 添加仓位
   * */
  addPosition(params: any): Observable<any> {
    return this.http.post(`api/position-add/`, JSON.stringify(params), {observe: 'response'});
  }

  /**
   * 获取仓位列表
   * */
  getPosition(params: string): Observable<any>  {
    return this.http.get(`api/position/?${params}`);
  }

  /**
   * 修改仓位
   * */
  updatePosition(params: any): Observable<any> {
    return this.http.post(`api/position-update/`, JSON.stringify(params), {observe: 'response'});
  }

  /**
   * 修改仓位状态
   * */
  updatePositionStatus(form: any): Observable<any> {
    return this.http.patch(`api/position/${form.id}/`, JSON.stringify(form), {observe: 'response'});
  }

  /**
   * 批量修改仓位状态
   * */
  bulkUpdatePositionStatus(form: any): Observable<any> {
    return this.http.post(`api/position-bulk-update/`, JSON.stringify(form), {observe: 'response'});
  }

}

// 仓库库存列表
export class WHStock {
  constructor(
    public id: number, // id
    public sku: string, // 产品sku编码
    public cn_name: string, // 产品名称
    public image: string, // 产品图片
    public all_stock: number, // 总库存
    public available_qty: number, // 可用库存(os)
    public reserved_qty: number, // 待出库(os)
    public on_way_qty: number, // 在途库存(os)
    public his_in_qty: number, // 历史入库数量(os)
    public his_sell_qty: number, // 历史销量(os)
    public avg_sell_qty: string, // 近30天平均销量(os)
    public avg_stock: string, // 近30天平均库存(os)
    public doi: string, // DOI(os)
    public is_return: boolean, // 是否退货库存(os)
    public is_active: boolean, // 产品是否有效(os)
    public is_prohibit: boolean, // 是否禁止出库(os)
    public position: string, // 仓位
  ) {}
}

// 仓库列表
export class Warehouse {
  constructor(
    public id: number, // id
    public wh_code: string, // 仓库代码
    public wh_id: string, // 仓库ID
    public wh_name: string, // 仓库名称
    public wh_address: string, // 仓库地址
    public return_name: string, // 仓库退货收件人
    public return_phone: string, // 仓库退货电话
    public return_address: string, // 仓库退货地址
    public post_name: string, // 仓库发货人姓名
    public post_phone: string, // 仓库发货人电话
    public post_address: string, // 仓库发货地址
    public is_active: boolean, // 是否启用
    public is_added: boolean, // 仓库是否已添加
    public wh_type: string, // 仓库类型
    public country_code: string, // 仓库所在国家代码
    public total_stock_num: number, // 库存总量
    public total_value: number, // 库存货值(元)
    public logistics_company: string // 物流公司
  ) {}
}

// 仓位
export class Position {
  constructor(
    public id: string, // id
    public po_code: string, // 仓位代码
    public col: number,
    public row: number,
    public is_active = true, // 是否启用
    public checked = false // 数据选择状态
  ) {}
}
