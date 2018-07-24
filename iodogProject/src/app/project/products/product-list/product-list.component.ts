import { Component, OnInit } from '@angular/core';
import {Product, ProductService} from '../../../shared/product.service';
import {sliceName} from '../../../utils/tools';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {ProductDisplaySettingComponent} from '../product-display-setting/product-display-setting.component';
import {SupplierAddComponent} from '../supplier-add/supplier-add.component';
import {ProductDetailComponent} from '../product-detail/product-detail.component';
import {AddCountryComponent} from '../add-country/add-country.component';
import {ProductBulkEditComponent} from '../product-bulk-edit/product-bulk-edit.component';
import {UploadsComponent} from '../../uploads/uploads.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
   product: Product[]; // 产品数据


  // 自定义显示
  display = {
    sku: true,
    cn_name: true,
    image: true,
    status: true,
    reg_status: true,
    cost: true,
    weight: true,
    create_time: false,
    supplier: true
};

  allChecked = false; // 全选状态
  indeterminate = false; // 选择框的不确定状态
  displayData: Array<{ id: number; checked: boolean }> = []; // 选择的数据显示
  disabledButton = true; // 操作按钮的可用显示状态
  checkedNumber = 0; // 已选择的行数量
  operating = false; // 操作loading状态

  nameFormat = sliceName; // 格式化显示长度

  p_status = 'ON_SALE'; // 产品状态：ALL:全部，ON_SALE：在售，OFFLINE：停售，CLEAN：清仓中，UNKNOWN：自动创建
  r_status = 'ALL'; // 产品注册状态
  search = '';  // 搜索值
  pageSize = 20;  // 默认一页显示条数
  totalCount = 0;  // 产品总数

  constructor(private productService: ProductService,
              private message: NzMessageService,
              private modalService: NzModalService) { }

  ngOnInit() {

    // 取出本地存储自定义设置信息
    const display_setting = localStorage.getItem('product_list_display');
    if (display_setting && display_setting !== 'undefined' && display_setting !== 'null') {
      this.display = JSON.parse(display_setting);
    }

    // 取出本地存储一页显示数设置信息
    const pagsize_setting = localStorage.getItem('product_list_pagesize');
    if (pagsize_setting && pagsize_setting !== 'undefined' && pagsize_setting !== 'null') {
      this.pageSize = Number(pagsize_setting);
    }

    const urlparams = new URLSearchParams();
    urlparams.append('status', this.p_status);
    urlparams.append('page_size', this.pageSize.toString());

    this.operating = true;
    this.productService.getProducts(urlparams.toString()).subscribe(
      val => {
        this.product = val.results;
        this.totalCount = val.count;
      },
      err => {
        this.message.create('error', `请求异常 ${err.statusText}`);
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
    this.disabledButton = !this.product.some(value => value.checked);
    this.checkedNumber = this.product.filter(value => value.checked).length;
  }

  // 操作数据
  operateData(): void {
    this.operating = true;
    setTimeout(_ => {
      this.product.forEach(value => {
        if (value.checked) {
          console.log(value.id);
        }
        value.checked = false;
      });
      this.refreshStatus();
      this.operating = false;
    }, 1000);
  }

  // 数据改变回调
  currentPageDataChange($event: Array<{ id: number; checked: boolean }>): void {
    this.displayData = $event;
  }

  // 自定义显示设置
  setDisplay(): void {
    const modal = this.modalService.create({
      nzTitle: '自定义显示列',
      nzMaskClosable: false,
      nzClosable: true,
      nzContent: ProductDisplaySettingComponent,
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
        localStorage.setItem('product_list_display', JSON.stringify(result.data));
        this.display = result.data;
        console.log(this.display);
      }
    });

  }

  /**
   * 查看、编辑商品详情弹框
   * */
  editProduct(id: number): void {
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
          this.listFilter();
        }
      }
    });
  }

  /**
   * 获取供应商列表数据（供调用）
   * */
  getProducts(params) {
    this.operating = true;
    this.productService.getProducts(params).subscribe(
      val => {
        this.product = val.results;
        this.totalCount = val.count;
      },
      err => {
        this.message.create('error', `请求异常 ${err.statusText}`);
        this.operating = false;
      },
      () => this.operating = false
    );
  }

  /**
   * 页码改变回调
   * */
  pageIndexChange(page) {
    const urlparams = new URLSearchParams();
    if (this.p_status !== 'ALL') {
      urlparams.append('status', this.p_status);
    }
    if (this.r_status !== 'ALL') {
      urlparams.append('product_reg_product__reg_product_reg_country__reg_status', this.p_status);
    }
    urlparams.append('page_size', this.pageSize.toString());
    if (this.search) {
      urlparams.append('search', this.search);
    }
    urlparams.append('page', page);

    this.getProducts(urlparams);
  }

  /**
   * 每页显示条数改变回调
   * */
  pageSizeChange(pageSize) {

    // 将一页显示数存储到本地
    localStorage.setItem('product_list_pagesize', pageSize)
    console.log(pageSize);

    const urlparams = new URLSearchParams();
    if (this.p_status !== 'ALL') {
      urlparams.append('status', this.p_status);
    }
    if (this.r_status !== 'ALL') {
      urlparams.append('product_reg_product__reg_product_reg_country__reg_status', this.p_status);
    }
    urlparams.append('page_size', pageSize.toString());
    if (this.search) {
      urlparams.append('search', this.search);
    }

    this.getProducts(urlparams);
  }

  /**
   * 删除产品
   * */
  deleteConfirm(id): void {
    this.modalService.confirm({
      nzTitle: '<i>是否确认要删除?</i>',
      nzContent: '<b>一旦删除将无法恢复</b>',
      nzOnOk: () => {
        this.operating = true;

        if (id) {  // 单个删除
          this.productService.deleteProduct(id).subscribe(
            val => {
              if (val.status === 204) {
                this.message.create('success', '删除成功！');
                this.listFilter(); // 刷新数据
              } else {
                this.message.create('error', `请求异常 ${val.statusText}`);
              }
              this.operating = false;
            },
            err => {
              this.message.create('error', `请求异常 ${err.statusText}`);
              this.operating = false;
            }
          );
        } else {  // 批量删除
          const ids = [];
          this.product.forEach(value => {
            if (value.checked) {
              ids.push(value.id);
            }
            value.checked = false;
          });
          this.productService.bulkDeleteProduct(ids).subscribe(
            val => {
              if (val.status === 204) {
                this.message.create('success', '删除成功！');
                this.listFilter(); // 刷新数据
              } else {
                this.message.create('error', `请求异常 ${val.statusText}`);
              }
              this.operating = false;
            },
            err => {
              this.message.create('error', `请求异常 ${err.statusText}`);
              this.operating = false;
            }
          );
        }
        this.refreshStatus();
      }
    });
  }

  /**
   * 单个增加注册国家
   * */
  addCountry(id: number): void {
    const p = this.product.find(item => item.id === id);
    const reg_country = []; // 获取当天注册国家数据
    if (p.product_reg_product) {
      for (let r of p.product_reg_product) {
        if (r.reg_product_reg_country) {
          for (let c of r.reg_product_reg_country) {
            reg_country.push(c.country_code)
          }
        }
      }
    }
    const modal = this.modalService.create({
      nzTitle: '增加注册国家',
      nzMaskClosable: false,
      nzClosable: false,
      nzContent: AddCountryComponent,
      nzComponentParams: {
        id: id,
        reg_country: reg_country ? reg_country : null
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
          }        },
      ]
    });

    // 模态框返回数据
    modal.afterClose.subscribe((result) => {
      // 如果正常返回，刷新注册产品数据
      if (result) {
        if (result.data === 'ok') {
          this.message.create('success', '注册成功！');
          this.listFilter(); // 刷新数据
          this.refreshStatus();
        }
      }
    });
  }

  /**
   * 批量编辑产品
   * */
  bulkEditProduct(): void {
    const ids = []; // 获取已选中的产品id
    this.product.forEach(value => {
      if (value.checked) {
        ids.push(value.id);
      }
    });
    const modal = this.modalService.create({
      nzTitle: `批量编辑产品(${ids.length})`,
      nzMaskClosable: false,
      nzClosable: false,
      nzContent: ProductBulkEditComponent,
      nzComponentParams: {
        ids: ids
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
          }        },
      ]
    });

    // 模态框返回数据
    modal.afterClose.subscribe((result) => {
      // 如果正常返回，刷新注册产品数据
      if (result) {
        if (result.data === 'ok') {
          this.message.create('success', '修改成功！');
          this.listFilter(); // 刷新数据
          this.refreshStatus();
        }
      }
    });
  }

  /**
   * 批量增加注册国家
   * */
  bulkRegAddCountry(): void {
    const ids = []; // 获取已选中的产品id
    this.product.forEach(value => {
      if (value.checked) {
        ids.push(value.id);
      }
      value.checked = false;
    });
    const modal = this.modalService.create({
      nzTitle: '批量增加注册国家',
      nzMaskClosable: false,
      nzClosable: false,
      nzContent: AddCountryComponent,
      nzComponentParams: {
        id: null,
        reg_country: null,
        ids: ids
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
          }        },
      ]
    });

    // 模态框返回数据
    modal.afterClose.subscribe((result) => {
      // 如果正常返回，刷新注册产品数据
      if (result) {
        if (result.data === 'ok') {
          this.message.create('success', '注册成功！');
          this.listFilter(); // 刷新数据
          this.refreshStatus();
        }
      }
    });
  }

  /**
   * 模板批量导入SKU
   * */
  bulkUploadProduct(): void {
    const modal = this.modalService.create({
      nzTitle: `批量导入产品`,
      nzMaskClosable: false,
      nzClosable: true,
      nzContent: UploadsComponent,
      nzComponentParams: {
        type: 'PRODUCT'
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
      // 如果正常返回，刷新注册产品数据
      if (result) {
        if (result.data === 'ok') {
          this.message.create('success', '修改成功！');
          this.listFilter(); // 刷新数据
          this.refreshStatus();
        }
      }
    });
  }

  /**
   * 模板批量导入虚拟SKU
   * */
  bulkUploadVsku(): void {
    const modal = this.modalService.create({
      nzTitle: `批量导入虚拟SKU`,
      nzMaskClosable: false,
      nzClosable: true,
      nzContent: UploadsComponent,
      nzComponentParams: {
        type: 'VSKU'
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
      // 如果正常返回，刷新注册产品数据
      if (result) {
        if (result.data === 'ok') {
          this.message.create('success', '修改成功！');
          this.listFilter(); // 刷新数据
          this.refreshStatus();
        }
      }
    });
  }

  /**
   * 产品筛选、搜索
   * */
  listFilter() {
    const urlparams = new URLSearchParams();
    if (this.p_status !== 'ALL') {
      urlparams.append('status', this.p_status);
    }
    if (this.r_status !== 'ALL') {
      urlparams.append('product_reg_product__reg_product_reg_country__reg_status', this.r_status);
    }
    urlparams.append('page_size', this.pageSize.toString());
    if (this.search) {
      urlparams.append('search', this.search);
    }
    this.getProducts(urlparams);
  }

}

