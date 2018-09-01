import { Component, OnInit } from '@angular/core';
import {Warehouse, WarehouseService} from '../../../shared/warehouse.service';
import {NzModalService} from 'ng-zorro-antd';
import {WarehouseAddComponent} from '../warehouse-add/warehouse-add.component';

@Component({
  selector: 'app-warehouse-settings',
  templateUrl: './warehouse-settings.component.html',
  styleUrls: ['./warehouse-settings.component.css']
})
export class WarehouseSettingsComponent implements OnInit {
  wh: Warehouse[]
  operating = false; // 操作loading状态
  changing = false; // 开关loading状态
  pageSize = 20;  // 默认一页显示条数
  totalCount = 0;  // 供应商总数
  is_active = 'true'; // 仓库状态
  wh_type = 'OS'; // 仓库类型

  constructor(private warehouseService: WarehouseService,
              private modalService: NzModalService) { }

  ngOnInit() {
    this.listFilter();
  }

  /**
   * 获取列表数据
   * */
  listFilter() {
    const urlparams = new URLSearchParams();
    urlparams.append('page_size', this.pageSize.toString());
    urlparams.append('wh_type', this.wh_type);
    if (this.is_active !== '') {
      urlparams.append('is_active', this.is_active);
    }
    this.getWarehouse(urlparams.toString());
  }

  /**
   * 切换tab回调
   * */
  changeTab(value) {
    this.wh_type = value;
    this.listFilter();
  }

  /**
   * 获取列表数据（供调用）
   * */
  getWarehouse(params) {
    this.operating = true;
    this.warehouseService.getWarehouse(params).subscribe(
      val => {
        this.wh = val.results;
        this.totalCount = val.count;

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
   * 修改仓库状态
   * */
  changeStatus(status, id) {
    this.changing = true;
    this.warehouseService.updateWarehouse({is_active: !status, id: id}).subscribe(
      val => {
        this.wh = val.results;
        this.totalCount = val.count;

      },
      err => {
        console.log(err);
        this.changing = false;
      },
      () => {
        this.changing = false;
        this.listFilter();
      }
    );
  }

  /**
   * 添加仓库
   * */
  addWarehouse(): void {
    const modal = this.modalService.create({
      nzTitle: '添加海外仓',
      nzMaskClosable: false,
      nzClosable: true,
      nzWidth: '1000px',
      nzContent: WarehouseAddComponent,
      nzComponentParams: {
        mode: 'ADD'
      },
      nzFooter: [
        {
          label: '关闭',
          shape: 'default',
          onClick: () => modal.destroy()
        },
      ]
    });

    // 模态框返回数据
    modal.afterClose.subscribe((result) => {
      if (result) {
        this.listFilter();
      }
    });

  }

  /**
   * 编辑仓库
   * */
  editWarehouse(wh): void {
    const modal = this.modalService.create({
      nzTitle: '仓库信息',
      nzMaskClosable: false,
      nzClosable: true,
      nzWidth: '800px',
      nzStyle: {top: '20px'},
      nzContent: WarehouseAddComponent,
      nzComponentParams: {
        mode: 'EDIT',
        wh: wh
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
            return componentInstance.operating;
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
        this.listFilter();
      }
    });

  }

}
