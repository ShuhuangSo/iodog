import { Component, OnInit } from '@angular/core';
import {Warehouse, WarehouseService, WHStock} from '../../../shared/warehouse.service';
import {ListDisplaySettingComponent} from '../../list-display-setting/list-display-setting.component';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {PlatformAuthAddComponent} from '../../settings/platform-auth-add/platform-auth-add.component';
import {WarehouseAddComponent} from '../warehouse-add/warehouse-add.component';

@Component({
  selector: 'app-warehouse-list',
  templateUrl: './warehouse-list.component.html',
  styleUrls: ['./warehouse-list.component.css']
})
export class WarehouseListComponent implements OnInit {
  wh_stock: WHStock[]; // 仓库库存
  wh: Warehouse[]; // 仓库列表

  operating = false; // 操作loading状态
  os_search = '';  // 海外仓搜索值
  pageSize = 20;  // 默认一页显示条数
  page = 1; // 默认页码
  ordering = ''; // 排序
  totalCount = 0;  // 产品总数
  wh_type = 'OS'; // 默认仓库类型
  is_onsale = 'true'; // 默认库存状态
  current_warehouse = null; // 当前仓库

  // 自定义显示{是否显示，字段名，显示名称，是否禁用}
  display = [
    {show: true, model_name: 'image', list_name: '缩略图', disabled: false},
    {show: true, model_name: 'sku', list_name: 'sku/中文名称', disabled: true},
    {show: true, model_name: 'available_qty', list_name: '可用库存', disabled: false},
    {show: true, model_name: 'reserved_qty', list_name: '待出库', disabled: false},
    {show: true, model_name: 'on_way_qty', list_name: '在途库存', disabled: false},
    {show: true, model_name: 'his', list_name: '历史入库数量/历史销量', disabled: false},
    {show: true, model_name: 'avg', list_name: '近30天平均销量/近30天平均库存', disabled: false},
    {show: false, model_name: 'avg15', list_name: '近15天平均销量/近15天平均库存', disabled: false},
    {show: false, model_name: 'avg7', list_name: '近7天平均销量/近7天平均库存', disabled: false},
    {show: true, model_name: 'doi', list_name: 'DOI', disabled: false},
  ];

  constructor(private warehouseService: WarehouseService,
              private message: NzMessageService,
              private modalService: NzModalService) { }

  ngOnInit() {
    // 取出本地存储自定义设置信息
    const display_setting = localStorage.getItem('os_warehouse_display');
    if (display_setting && display_setting !== 'undefined' && display_setting !== 'null') {
      this.display = JSON.parse(display_setting);
    }

    // 取出本地存储一页显示数设置信息
    const pagsize_setting = localStorage.getItem('warehouse_list_pagesize');
    if (pagsize_setting && pagsize_setting !== 'undefined' && pagsize_setting !== 'null') {
      this.pageSize = Number(pagsize_setting);
    }

    this.getWarehouseList();
  }

  /**
   * 获取仓库名称列表数据
   * */
  getWarehouseList() {
    const urlparams = new URLSearchParams();
    urlparams.append('wh_type', this.wh_type);
    urlparams.append('is_active', 'true');

    this.operating = true;
    this.warehouseService.getWarehouse(urlparams.toString()).subscribe(
      val => {
        this.wh = val.results;
        if (this.wh.length) {
          this.current_warehouse = this.wh[0].id;
          this.OS_listFilter();
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
   * 清除海外仓搜索
   * */
  cleanSearch() {
    this.os_search = '';
    this.OS_listFilter();
  }

  /**
   * 获取海外仓列表数据
   * */
  OS_listFilter() {
    const urlparams = new URLSearchParams();
    urlparams.append('page_size', this.pageSize.toString());
    urlparams.append('page', this.page.toString());
    urlparams.append('wh_type', 'OS');
    if (this.ordering !== '') {
      urlparams.append('ordering', this.ordering);
    }
    if (this.is_onsale !== '') {
      urlparams.append('is_onsale', this.is_onsale);
    }
    if (this.os_search !== '') {
      urlparams.append('search', this.os_search);
    }
    if (this.current_warehouse) {
      urlparams.append('warehouse', this.current_warehouse);
    }
    this.getWarehouseStock(urlparams.toString());
  }

  /**
   * 获取列表数据（供调用）
   * */
  getWarehouseStock(params) {
    this.operating = true;
    this.warehouseService.getWarehouseStock(params).subscribe(
      val => {
        this.wh_stock = val.results;
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
   * 启用/停用库存商品
   * */
  changeStatus(id: number, status: boolean) {
    this.warehouseService.updateWarehouseStock({id: id, is_onsale: !status}).subscribe(
      val => {
        if (val.status === 200) {
          this.message.create('success', '操作成功');
          this.operating = false;
          this.OS_listFilter(); // 刷新数据
        }
      },
      err => {
        console.log(err)
        this.operating = false;
      },
    () => {
      this.operating = false;
      }
    );
  }

  /**
   * 每页显示条数改变回调
   * */
  pageSizeChange(pageSize) {

    // 将一页显示数存储到本地
    localStorage.setItem('warehouse_list_pagesize', pageSize)

    this.pageSize = pageSize;
    this.OS_listFilter();
  }

  /**
   * 页码改变回调
   * */
  pageIndexChange(page) {
    this.page = page;
    this.OS_listFilter();
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
