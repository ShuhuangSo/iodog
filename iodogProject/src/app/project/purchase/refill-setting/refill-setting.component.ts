import { Component, OnInit } from '@angular/core';
import {NzModalRef} from 'ng-zorro-antd';
import {PurchaseService, RefillSetting} from '../../../shared/purchase.service';

@Component({
  selector: 'app-refill-setting',
  templateUrl: './refill-setting.component.html',
  styleUrls: ['./refill-setting.component.css']
})
export class RefillSettingComponent implements OnInit {
  refill_setting: RefillSetting[];
  isSpinning = false; // 加载状态

  id: number;
  is_active = false;
  stock_days = 45;
  min_buy = 5;
  auto_carry = 0;
  is_auto_calc = false;
  remind_weight = 0;
  remind_sku_qty = 0;
  remind_total_qty = 0;

  constructor(private modal: NzModalRef,
              private purchaseService: PurchaseService) { }

  ngOnInit() {
    this.getRefillPromote();
  }

  /**
   * 获取补货推荐列表数据（供调用）
   * */
  getRefillPromote() {
    this.isSpinning = true;
    this.purchaseService.getRefillSetting().subscribe(
      val => {
        this.refill_setting = val;
        this.refill_setting.forEach(value => {
          this.id = value.id;
          this.is_active = value.is_active;
          this.stock_days = value.stock_days;
          this.min_buy = value.min_buy;
          this.auto_carry = value.auto_carry;
          this.is_auto_calc = value.is_auto_calc;
          this.remind_weight = value.remind_weight;
          this.remind_sku_qty = value.remind_sku_qty;
          this.remind_total_qty = value.remind_total_qty;
        });
      },
      err => {
        console.log(err);
        this.isSpinning = false;
      },
      () => {
        this.isSpinning = false;
      }
    );
  }

  // 确认提交
  destroyModal(): void {
    const setting = {
      'id': this.id,
      'is_active': this.is_active,
      'stock_days': this.stock_days,
      'min_buy': this.min_buy,
      'auto_carry': this.auto_carry,
      'is_auto_calc': this.is_auto_calc,
      'remind_weight': this.remind_weight,
      'remind_sku_qty': this.remind_sku_qty,
      'remind_total_qty': this.remind_total_qty
    }

    this.isSpinning = true;
    this.purchaseService.updateRefillSetting(setting).subscribe(
      val => {
        if (val.status === 200) {
          this.modal.destroy({ data: 'ok' });
        }
      },
      err => {
        console.log(err);
        this.isSpinning = false;
      },
      () => {
        this.isSpinning = false;
      }
    );
  }

}
