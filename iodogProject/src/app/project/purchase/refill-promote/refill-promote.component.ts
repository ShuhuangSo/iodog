/*
**
** 补货推荐
**
 */
import { Component, OnInit } from '@angular/core';
import {PurchaseService, RefillPromote} from '../../../shared/purchase.service';
import {Warehouse, WarehouseService} from '../../../shared/warehouse.service';
import {ProductDetailComponent} from '../../products/product-detail/product-detail.component';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {RefillSettingComponent} from '../refill-setting/refill-setting.component';

@Component({
  selector: 'app-refill-promote',
  templateUrl: './refill-promote.component.html',
  styleUrls: ['./refill-promote.component.css']
})
export class RefillPromoteComponent implements OnInit {
  promote: RefillPromote[];
  wh: Warehouse[]; // 海外仓仓库列表

  allChecked = false; // 全选状态
  indeterminate = false; // 选择框的不确定状态
  displayData: Array<{ id: number; checked: boolean }> = []; // 选择的数据显示
  disabledButton = true; // 操作按钮的可用显示状态
  checkedNumber = 0; // 已选择的行数量
  operating = false; // 操作loading状态
  total_weight = 0; // 总重量
  loading = false; // 手动计算按钮加载状态

  current_warehouse = null; // 海外仓当前仓库

  constructor(private purchaseService: PurchaseService,
              private warehouseService: WarehouseService,
              private message: NzMessageService,
              private modalService: NzModalService) { }

  ngOnInit() {
    this.getWarehouseList();
  }

  // 处理全选/全不选
  checkAll(value: boolean): void {
    this.displayData.forEach(data => data.checked = value);
    this.refreshStatus();
  }

  // 刷新选择状态
  refreshStatus(): void {
    const allChecked = this.displayData.every(value => value.checked === true);
    const allUnChecked = this.displayData.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
    this.disabledButton = !this.promote.some(value => value.checked);
    this.checkedNumber = this.promote.filter(value => value.checked).length;
    this.refreshWeight();
  }

  // 刷新总重量
  refreshWeight() {
    if (this.checkedNumber) {
      this.total_weight = 0;
      this.promote.forEach(value => {
        if (value.checked) {
          this.total_weight = value.product_weight * value.buy_qty + this.total_weight;
        }
      });
    }
  }

  // 数据改变回调
  currentPageDataChange($event: Array<{ id: number; checked: boolean }>): void {
    this.displayData = $event;
  }

  /**
   * 获取海外仓仓库名称列表数据
   * */
  getWarehouseList() {
    const urlparams = new URLSearchParams();
    urlparams.append('wh_type', 'OS');
    urlparams.append('is_active', 'true');

    this.operating = true;
    this.warehouseService.getWarehouse(urlparams.toString()).subscribe(
      val => {
        this.wh = val.results;
        if (this.wh.length) {
          this.current_warehouse = this.wh[0].id;
          this.listFilter();
        }

      },
      err => {
        console.log(err);
        this.operating = false;
      },
      () => {
        this.operating = false;
      }
    );
  }

  /**
   * 获取补货推荐列表数据（供调用）
   * */
  getRefillPromote(params) {
    this.operating = true;
    this.purchaseService.getRefillPromote(params).subscribe(
      val => {
        this.promote = val;
      },
      err => {
        console.log(err);
        this.operating = false;
      },
      () => {
        this.operating = false;
      }
    );
  }

  /**
   * 获取补货推荐
   * */
  listFilter() {
    const urlparams = new URLSearchParams();
    urlparams.append('warehouse', this.current_warehouse);
    this.getRefillPromote(urlparams.toString());
  }

  /**
   * 手动计算补货推荐
   * */
  manualCalc() {
    this.loading = true;
    this.purchaseService.manualCalcRefillPromote().subscribe(
      val => {
        if (val.status === 200) {
          this.listFilter();
        }
      },
      err => {
        console.log(err);
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
  }

  /**
   * 查看商品
   * */
  editProduct(id) {
    if (id) {
      this.goProduct(id);
    } else {
      this.message.create('error', '该产品不在产品库中！');
    }
  }

  /**
   * 编辑补货推荐设置
   * */
  editRefillSetting(): void {
    const modal = this.modalService.create({
      nzTitle: '补货推荐设置',
      nzMaskClosable: false,
      nzClosable: true,
      nzWidth: '800px',
      nzContent: RefillSettingComponent,
      nzComponentParams: {
        mode: 'EDIT',
      },
      nzFooter: [
        {
          label: '取消',
          shape: 'default',
          onClick: () => modal.destroy()
        },
        {
          label: '确认',
          type: 'primary',
          loading: ((componentInstance) => {
            return componentInstance.isSpinning;
          }),
          onClick: (componentInstance) => {
            componentInstance.destroyModal();
          }
        },
      ]
    });

    // 模态框返回数据
    modal.afterClose.subscribe((result) => {
      if (result) {
        this.message.create('success', '设置成功！');
      }
    });

  }

  /**
   * 查看、编辑商品详情弹框
   * */
  goProduct(id): void {
    const modal = this.modalService.create({
      nzTitle: '商品详情',
      nzMaskClosable: true,
      nzClosable: true,
      nzWidth: '90%',
      nzStyle: {top: '20px'},
      nzContent: ProductDetailComponent,
      nzComponentParams: {
        productId: id,
      },
      nzFooter: [
        {
          label: '取消',
          shape: 'default',
          onClick: () => modal.destroy()
        },
        {
          label: '确认',
          type: 'primary',
          loading: ((componentInstance) => {
            return componentInstance.isSpinning;
          }),
          onClick: (componentInstance) => {
            componentInstance.destroyModal();
          }
        },
      ]
    });

    // 模态框返回数据
    modal.afterClose.subscribe((result) => {
      // 如果正常返回，刷新产品列表数据
      if (result) {
        if (result.data === 'ok') {
          this.message.create('success', '产品修改成功！');
        }
      }
    });
  }

}
