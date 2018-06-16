import { Component, OnInit } from '@angular/core';
import {ProductService, Supplier} from '../../../shared/product.service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {ListDisplaySettingComponent} from '../../list-display-setting/list-display-setting.component';
import {SupplierAddComponent} from '../supplier-add/supplier-add.component';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent implements OnInit {
  supplier: Supplier[];

  allChecked = false; // 全选状态
  indeterminate = false; // 选择框的不确定状态
  displayData: Array<{ id: number; checked: boolean }> = []; // 选择的数据显示
  disabledButton = true; // 操作按钮的可用显示状态
  checkedNumber = 0; // 已选择的行数量
  operating = false; // 操作loading状态

  status = 'true'; // 供应商状态：ALL:全部，true：启用，false：停用
  search = '';  // 搜索值
  pageSize = 20;  // 默认一页显示条数
  totalCount = 0;  // 供应商总数

  // 自定义显示{是否显示，字段名，显示名称，是否禁用}
  display = [
    {show: true, model_name: 'supplier_name', list_name: '供应商名称', disabled: true},
    {show: true, model_name: 'buy_way', list_name: '采购渠道', disabled: false},
    {show: true, model_name: 'store_url', list_name: '店铺链接', disabled: false},
    {show: false, model_name: 'qq', list_name: 'qq', disabled: false},
    {show: false, model_name: 'phone', list_name: '手机', disabled: false},
    {show: true, model_name: 'address', list_name: '地址', disabled: false},
    {show: false, model_name: 'note', list_name: '备注', disabled: false},
    {show: true, model_name: 'status', list_name: '状态', disabled: false},
    ];

  constructor(private productService: ProductService,
              private message: NzMessageService,
              private modalService: NzModalService) { }

  ngOnInit() {

    // 取出本地存储自定义设置信息
    const display_setting = localStorage.getItem('supplier_list_display');
    if (display_setting && display_setting !== 'undefined' && display_setting !== 'null') {
      this.display = JSON.parse(display_setting);
    }

    // 取出本地存储一页显示数设置信息
    const pagsize_setting = localStorage.getItem('supplier_list_pagesize');
    if (pagsize_setting && pagsize_setting !== 'undefined' && pagsize_setting !== 'null') {
      this.pageSize = Number(pagsize_setting);
    }

    // 向服务器获取供应商列表数据
    this.operating = true;
    const urlparams = new URLSearchParams();
    urlparams.append('status', this.status);
    urlparams.append('page_size', this.pageSize.toString());

    this.productService.getSuppliers(urlparams.toString()).subscribe(
      val => {
        this.supplier = val.results;
        this.totalCount = val.count;
        console.log(val);
      },
      err => {
        this.message.create('error', `请求异常 ${err.statusText}`);
        this.operating = false;
      },
      () => this.operating = false
    );

  }

  /**
   * 获取供应商列表数据（供调用）
   * */
  getSuppliers(params) {
    this.operating = true;
    this.productService.getSuppliers(params).subscribe(
      val => {
        this.supplier = val.results;
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
   * 每页显示条数改变回调
   * */
  pageSizeChange(pageSize) {

    // 将一页显示数存储到本地
    localStorage.setItem('supplier_list_pagesize', pageSize)
    console.log(pageSize);

    const urlparams = new URLSearchParams();
    if (this.status !== 'ALL') {
      urlparams.append('status', this.status);
    }
    urlparams.append('page_size', pageSize.toString());
    if (this.search) {
      urlparams.append('search', this.search);
    }

    this.getSuppliers(urlparams);


  }

  /**
   * 页码改变回调
   * */
  pageIndexChange(page) {
    const urlparams = new URLSearchParams();
    if (this.status !== 'ALL') {
      urlparams.append('status', this.status);
    }
    urlparams.append('page_size', this.pageSize.toString());
    if (this.search) {
      urlparams.append('search', this.search);
    }
    urlparams.append('page', page);

    this.getSuppliers(urlparams);
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
    this.disabledButton = !this.supplier.some(value => value.checked);
    this.checkedNumber = this.supplier.filter(value => value.checked).length;
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
        localStorage.setItem('supplier_list_display', JSON.stringify(result.data));
        this.display = result.data;
        console.log(this.display);
      }
    });

  }


  /**
   * 添加、编辑供应商
   * */
  addSupplier(id: number): void {
    const modal = this.modalService.create({
      nzTitle: id ? '编辑供应商' : '添加供应商',
      nzMaskClosable: false,
      nzClosable: true,
      nzWidth: '800px',
      nzContent: SupplierAddComponent,
      nzComponentParams: {
        supplier: id ? this.supplier.find((sup => sup.id === id)) : null,
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
        this.listFilter(); // 刷新列表数据
        console.log('1：' + result);
      }
    });

  }

  /**
   * 供应商筛选、搜索
   * */
  listFilter() {
    const urlparams = new URLSearchParams();
    if (this.status !== 'ALL') {
      urlparams.append('status', this.status);
    }
    urlparams.append('page_size', this.pageSize.toString());
    if (this.search) {
      urlparams.append('search', this.search);
    }
    this.getSuppliers(urlparams);
  }

  /**
   * 启用/停用供应商
   * */
  changeStatus(id: number, status: boolean) {
    this.productService.changeSupplierStatus(id, !status).subscribe(
      val => {
        console.log(val.status);
        if (val.status === 200) {
          this.message.create('success', status ? '供应商已停用！' : '供应商已启用！');
          this.operating = false;
          this.listFilter(); // 刷新数据
        } else {
          this.message.create('error', `请求异常 ${val.status}`);
        }
      },
      err => {
        this.message.create('error', `请求异常 ${err.statusText}`);
        this.operating = false;
      });
  }

  /**
   * 删除供应商
   * */
  deleteConfirm(id): void {
    this.modalService.confirm({
      nzTitle: '<i>是否确认要删除?</i>',
      nzContent: '<b>一旦删除将无法恢复</b>',
      nzOnOk: () => {
        this.operating = true;

          if (id) {  // 单个删除
            this.productService.deleteSupplier(id).subscribe(
              val => {
                console.log(val.status);
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
            this.supplier.forEach(value => {
              if (value.checked) {
                ids.push(value.id);
              }
              value.checked = false;
            });
            console.log(ids);
            this.productService.bulkDeleteSupplier(ids).subscribe(
              val => {
                console.log(val.status);
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


}
