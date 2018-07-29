import {Component, Input, OnInit} from '@angular/core';
import {ProductService, SupplierProduct} from '../../../shared/product.service';
import {NzModalRef, NzModalService} from 'ng-zorro-antd';
import {ListDisplaySettingComponent} from '../../list-display-setting/list-display-setting.component';
import {SupplierProductAddComponent} from '../supplier-product-add/supplier-product-add.component';

@Component({
  selector: 'app-supplier-product',
  templateUrl: './supplier-product.component.html',
  styleUrls: ['./supplier-product.component.css']
})
export class SupplierProductComponent implements OnInit {
  @Input() supplier_id: number;

  supplier_product: SupplierProduct[]

  allChecked = false; // 全选状态
  indeterminate = false; // 选择框的不确定状态
  displayData: Array<{ id: number; checked: boolean }> = []; // 选择的数据显示
  disabledButton = true; // 操作按钮的可用显示状态
  checkedNumber = 0; // 已选择的行数量
  operating = false; // 操作loading状态

  primary_supplier = 'ALL'; // 默认供应商状态：ALL:全部，true：默认，false：非默认
  search = '';  // 搜索值
  pageSize = 20;  // 默认一页显示条数
  totalCount = 0;  // 供应商总数

  // 自定义显示{是否显示，字段名，显示名称，是否禁用}
  display = [
    {show: true, model_name: 'buy_url', list_name: '采购链接', disabled: false},
    {show: true, model_name: 'primary_supplier', list_name: '默认供应商', disabled: false},
    {show: false, model_name: 'create_time', list_name: '创建时间', disabled: false},
    {show: true, model_name: 'sku', list_name: 'SKU', disabled: true},
    {show: true, model_name: 'cn_name', list_name: '产品名称', disabled: true},
  ];

  constructor(
    private productService: ProductService,
    private modal: NzModalRef,
    private modalService: NzModalService
  ) { }

  ngOnInit() {
    // 向服务器获取供应商关联产品列表数据
    this.operating = true;
    const urlparams = new URLSearchParams();
    urlparams.append('supplier', this.supplier_id.toString());

    this.productService.getSupplierProductsBySupplier_id(urlparams.toString()).subscribe(
      val => {
        this.supplier_product = val.results;
        this.totalCount = val.count;
      },
      err => {
        console.log(err)
        this.operating = false;
      },
      () => this.operating = false
    );
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
    this.disabledButton = !this.supplier_product.some(value => value.checked);
    this.checkedNumber = this.supplier_product.filter(value => value.checked).length;
  }

  // 数据改变回调
  currentPageDataChange($event: Array<{ id: number; checked: boolean }>): void {
    this.displayData = $event;
  }

  // 处理显示列表字段状态
  checkDisplay(model_name: string): boolean {
    const dp = this.display.filter(disp => disp.model_name === model_name);
    return dp[0].show;
  }

  /**
   * 获取供应商关联产品列表数据（供调用）
   * */
  getSupplierProducts(params) {
    params.append('supplier', this.supplier_id.toString());
    this.operating = true;
    this.productService.getSupplierProductsBySupplier_id(params).subscribe(
      val => {
        this.supplier_product = val.results;
        this.totalCount = val.count;
      },
      err => {
        console.log(err)
        this.operating = false;
      },
      () => this.operating = false
    );
  }

  /**
   * 每页显示条数改变回调
   * */
  pageSizeChange(pageSize) {

    const urlparams = new URLSearchParams();
    if (this.primary_supplier !== 'ALL') {
      urlparams.append('primary_supplier', this.primary_supplier);
    }
    urlparams.append('page_size', pageSize.toString());
    if (this.search) {
      urlparams.append('search', this.search);
    }

    this.getSupplierProducts(urlparams);


  }

  /**
   * 页码改变回调
   * */
  pageIndexChange(page) {
    const urlparams = new URLSearchParams();
    if (this.primary_supplier !== 'ALL') {
      urlparams.append('primary_supplier', this.primary_supplier);
    }
    urlparams.append('page_size', this.pageSize.toString());
    if (this.search) {
      urlparams.append('search', this.search);
    }
    urlparams.append('page', page);

    this.getSupplierProducts(urlparams);
  }

  /**
   * 供应商关联产品筛选、搜索
   * */
  listFilter() {
    const urlparams = new URLSearchParams();
    if (this.primary_supplier !== 'ALL') {
      urlparams.append('primary_supplier', this.primary_supplier);
    }
    urlparams.append('page_size', this.pageSize.toString());
    if (this.search) {
      urlparams.append('search', this.search);
    }
    this.getSupplierProducts(urlparams);
  }

  /**
   * 清除搜索
   * */
  cleanSearch() {
    this.search = '';
    this.listFilter();
  }

  /**
   * 解除关联产品
   * */
  deleteSupplierProduct(id): void {
    this.modalService.confirm({
      nzTitle: '<i>是否确认解除该产品?</i>',
      nzContent: '<b>解除后可重新绑定</b>',
      nzOnOk: () => {
        if (id) {
          this.operating = true;
          this.productService.deleteSupplierProduct(id).subscribe(
            val => {
              if (val.status === 204) {
                this.listFilter(); // 刷新数据
              } else {
                console.log(val.statusText);
              }
            },
            err => {
              console.log(err);
              this.operating = false;
            },
            () => this.operating = false
          );
        } else {
          this.bulkDeleteSupplierProduct();
        }

      }
    });
  }

  /**
   * 批量解除关联产品
   * */
  bulkDeleteSupplierProduct(): void {
    this.operating = true;
    const ids = [];
    this.supplier_product.forEach(value => {
      if (value.checked) {
        ids.push(value.id);
      }
      value.checked = false;
    });
    this.productService.bulkDeleteSupplierProduct(ids).subscribe(
      val => {
        if (val.status === 204) {
          this.listFilter(); // 刷新数据
        } else {
          console.log(val);
        }
        this.operating = false;
      },
      err => {
        console.log(err)
        this.operating = false;
      }
    );
  }

  /**
   * 供应商关联产品添加
   * */
  addSupplierProduct(): void {
    const modal = this.modalService.create({
      nzTitle: '新增关联产品',
      nzMaskClosable: false,
      nzClosable: true,
      nzWidth: '800',
      nzContent: SupplierProductAddComponent,
      nzComponentParams: {
        supplier_id: this.supplier_id,
        mode: 'ADD'
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
        this.listFilter(); // 刷新列表数据
      }
    });

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
        this.display = result.data;
        console.log(this.display);
      }
    });

  }

  destroyModal(): void {}

}
