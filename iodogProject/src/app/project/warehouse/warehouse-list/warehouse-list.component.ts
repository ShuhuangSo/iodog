import { Component, OnInit } from '@angular/core';
import {WarehouseService, WHStock} from '../../../shared/warehouse.service';
import {ListDisplaySettingComponent} from '../../list-display-setting/list-display-setting.component';
import {NzModalService} from 'ng-zorro-antd';
import {PlatformAuthAddComponent} from '../../settings/platform-auth-add/platform-auth-add.component';
import {WarehouseAddComponent} from '../warehouse-add/warehouse-add.component';

@Component({
  selector: 'app-warehouse-list',
  templateUrl: './warehouse-list.component.html',
  styleUrls: ['./warehouse-list.component.css']
})
export class WarehouseListComponent implements OnInit {
  wh_stock: WHStock[]

  operating = false; // 操作loading状态
  search = '';  // 搜索值
  pageSize = 20;  // 默认一页显示条数
  totalCount = 0;  // 产品总数

  // 自定义显示{是否显示，字段名，显示名称，是否禁用}
  display = [
    {show: true, model_name: 'image', list_name: '缩略图', disabled: false},
    {show: true, model_name: 'sku', list_name: 'sku/中文名称', disabled: true},
    {show: true, model_name: 'available_qty', list_name: '可用库存', disabled: false},
    {show: true, model_name: 'reserved_qty', list_name: '待出库', disabled: false},
    {show: true, model_name: 'on_way_qty', list_name: '在途库存', disabled: false},
    {show: true, model_name: 'his', list_name: '历史入库数量/历史销量', disabled: false},
    {show: true, model_name: 'avg', list_name: '近30天平均销量/近30天平均库存', disabled: false},
    {show: true, model_name: 'doi', list_name: 'DOI', disabled: false},
  ];

  constructor(private warehouse: WarehouseService,
              private modalService: NzModalService) { }

  ngOnInit() {
    // 取出本地存储自定义设置信息
    const display_setting = localStorage.getItem('os_warehouse_display');
    if (display_setting && display_setting !== 'undefined' && display_setting !== 'null') {
      this.display = JSON.parse(display_setting);
    }

    this.wh_stock = this.warehouse.getWHStock();
  }

  /**
   * 处理显示列表字段状态
   * */
  checkDisplay(model_name: string): boolean {
    const dp = this.display.filter(disp => disp.model_name === model_name);
    return dp[0].show;
  }

  /**
   * 自定义列显示设置
   * */
  setDisplay(): void {
    const modal = this.modalService.create({
      nzTitle: '自定义显示列',
      nzMaskClosable: false,
      nzClosable: true,
      nzContent: ListDisplaySettingComponent,
      nzComponentParams: {
        display: this.display,
      },
      nzFooter: [
        {
          label: '确认',
          type: 'primary',
          onClick: (componentInstance) => {
            componentInstance.destroyModal();
          }
        },
      ]
    });

    // 模态框返回数据
    modal.afterClose.subscribe((result) => {
      if (result) {
        // 将设置信息保存到本地存储
        localStorage.setItem('os_warehouse_display', JSON.stringify(result.data));
        this.display = result.data;
        console.log(this.display);
      }
    });

  }


}
