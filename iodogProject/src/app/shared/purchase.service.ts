import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class PurchaseService {

  constructor(private http: HttpClient) { }

  /**
   * 获取补货推荐
   * */
  getRefillPromote(params: string): Observable<any>  {
    return this.http.get(`api/refill-promote/?${params}`);
  }

  /**
   * 手动计算补货推荐
   * */
  manualCalcRefillPromote(): Observable<any>  {
    return this.http.get(`api/refill-calc/`, {observe: 'response'});
  }

  /**
   * 获取补货推荐设置
   * */
  getRefillSetting(): Observable<any>  {
    return this.http.get(`api/refill-setting/`);
  }

  /**
   * 修改补货推荐设置
   * */
  updateRefillSetting(form: any): Observable<any> {
    return this.http.patch(`api/refill-setting/${form.id}/`, JSON.stringify(form), {observe: 'response'});
  }

}

// 补货推荐
export class RefillPromote {
  constructor(
    public id: number, // id
    public sku: string, // 产品sku编码
    public cn_name: string, // 产品名称
    public image: string, // 产品图片
    public product_weight: number, // 产品重量
    public buy_qty: number, // 补货数量
    public available_qty: number, // 可用库存(os)
    public on_way_qty: number, // 在途库存(os)
    public avg_sell_qty15: string, // 近15天平均销量(os)
    public avg_sell_qty7: string, // 近7天平均销量(os)
    public doi: string, // DOI(os)
    public trend: string, // 销量趋势
    public product_id: number, // 产品在产品库id
    public checked: boolean // 数据选择状态
  ) {}
}

// 补货推荐设置
export class RefillSetting {
  constructor(
    public id: number, // id
    public stock_days: number, // 库存备货天数
    public min_buy: number, // 最少采购个数
    public auto_carry: number, // 自动进位
    public is_auto_calc: boolean, // 是否自动计算
    public remind_weight: number, // 自动计算提醒重量
    public remind_sku_qty: number, // 提醒商品SKU数
    public remind_total_qty: number, // 提醒总商品数
    public is_active: boolean // 是否开启
  ) {}
}
