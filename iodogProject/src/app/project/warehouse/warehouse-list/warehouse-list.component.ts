import { Component, OnInit } from '@angular/core';
import {Warehouse, WarehouseService, WHStock} from '../../../shared/warehouse.service';
import {ListDisplaySettingComponent} from '../../list-display-setting/list-display-setting.component';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {PlatformAuthAddComponent} from '../../settings/platform-auth-add/platform-auth-add.component';
import {WarehouseAddComponent} from '../warehouse-add/warehouse-add.component';
import {ProductDetailComponent} from '../../products/product-detail/product-detail.component';

@Component({
  selector: 'app-warehouse-list',
  templateUrl: './warehouse-list.component.html',
  styleUrls: ['./warehouse-list.component.css']
})
export class WarehouseListComponent implements OnInit {
  wh_stock: WHStock[]; // 海外仓仓库库存
  wh_stock2: WHStock[]; // 本地仓库库存
  wh: Warehouse[]; // 海外仓仓库列表
  wh2: Warehouse[]; // 本地仓仓库列表

  operating = false; // 操作loading状态
  operating2 = false; // 操作loading状态
  os_search = '';  // 海外仓搜索值
  local_search = '';  // 本地仓搜索值
  pageSize = 20;  // 默认一页显示条数
  page = 1; // 默认页码
  ordering = ''; // 排序
  is_return = ''; // 是否为退货商品
  totalCount = 0;  // 产品总数
  wh_type = 'OS'; // 默认仓库类型
  is_onsale = 'true'; // 默认库存状态
  current_warehouse = null; // 海外仓当前仓库
  current_warehouse2 = null; // 本地仓当前仓库
  edit_status = false; // 编辑状态
  doi_status = ''; // 周转状态

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
   * 获取海外仓仓库名称列表数据
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
    if (this.ordering !== '') {
      urlparams.append('ordering', this.ordering);
    }
    if (this.is_onsale !== '') {
      urlparams.append('is_onsale', this.is_onsale);
    }
    if (this.is_return !== '') {
      urlparams.append('is_return', this.is_return);
    }
    if (this.os_search !== '') {
      urlparams.append('search', this.os_search);
    }
    if (this.doi_status !== '') {
      if (this.doi_status === 'FAST') {
        urlparams.append('min_doi', '0.001');
        urlparams.append('max_doi', '30');
      }
      if (this.doi_status === 'NORMAL') {
        urlparams.append('min_doi', '30.001');
        urlparams.append('max_doi', '50');
      }
      if (this.doi_status === 'WARN') {
        urlparams.append('min_doi', '50.001');
        urlparams.append('max_doi', '60');
      }
      if (this.doi_status === 'SLOW') {
        urlparams.append('min_doi', '60.001');
      }
    }
    if (this.current_warehouse) {
      urlparams.append('warehouse', this.current_warehouse);
    }
    this.getWarehouseStock(urlparams.toString());
  }

  /**
   * 获取本地仓仓库名称列表数据
   * */
  getLocalWarehouseList() {
    const urlparams = new URLSearchParams();
    urlparams.append('wh_type', 'LOCAL');
    urlparams.append('is_active', 'true');

    this.operating2 = true;
    this.warehouseService.getWarehouse(urlparams.toString()).subscribe(
      val => {
        this.wh2 = val.results;
        if (this.wh2.length) {
          this.current_warehouse2 = this.wh2[0].id;
          this.LOCAL_listFilter();
        }

      },
      err => {
        console.log(err);
        this.operating2 = false;
      },
      () => {
        this.operating2 = false;
      }
    );
  }

  /**
   * 清除海外仓搜索
   * */
  cleanLocalSearch() {
    this.local_search = '';
    this.LOCAL_listFilter();
  }

  /**
   * 获取本地仓列表数据
   * */
  LOCAL_listFilter() {
    const urlparams = new URLSearchParams();
    urlparams.append('page_size', this.pageSize.toString());
    urlparams.append('page', this.page.toString());
    if (this.ordering !== '') {
      urlparams.append('ordering', this.ordering);
    }
    if (this.is_onsale !== '') {
      urlparams.append('is_onsale', this.is_onsale);
    }
    if (this.is_return !== '') {
      urlparams.append('is_return', this.is_return);
    }
    if (this.local_search !== '') {
      urlparams.append('search', this.local_search);
    }
    if (this.current_warehouse2) {
      urlparams.append('warehouse', this.current_warehouse2);
    }
    this.getLocalWarehouseStock(urlparams.toString());
  }

  /**
   * 获取列表数据（供海外仓调用）
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
   * 获取列表数据（供本地仓调用）
   * */
  getLocalWarehouseStock(params) {
    this.operating2 = true;
    this.warehouseService.getWarehouseStock(params).subscribe(
      val => {
        this.wh_stock2 = val.results;
        this.totalCount = val.count;

      },
      err => {
        console.log(err);
        this.operating2 = false;
      },
      () => {
        this.operating2 = false;
      }
    );
  }

  /**
   * 启用/停用海外仓库存商品
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
   * 启用/停用本地仓库存商品
   * */
  changeLocalStatus(id: number, status: boolean) {
    this.warehouseService.updateWarehouseStock({id: id, is_onsale: !status}).subscribe(
      val => {
        if (val.status === 200) {
          this.message.create('success', '操作成功');
          this.operating2 = false;
          this.LOCAL_listFilter(); // 刷新数据
        }
      },
      err => {
        console.log(err)
        this.operating2 = false;
      },
      () => {
        this.operating2 = false;
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
