import { Component, OnInit } from '@angular/core';
import {Combo, ProductService} from '../../../shared/product.service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {ListDisplaySettingComponent} from '../../list-display-setting/list-display-setting.component';
import {ComboAddComponent} from '../combo-add/combo-add.component';
import {ProductDetailComponent} from '../product-detail/product-detail.component';
import {ComboNewaddComponent} from '../combo-newadd/combo-newadd.component';

@Component({
  selector: 'app-combo',
  templateUrl: './combo.component.html',
  styleUrls: ['./combo.component.css']
})
export class ComboComponent implements OnInit {
  combo: Combo [];

  allChecked = false; // 全选状态
  indeterminate = false; // 选择框的不确定状态
  displayData: Array<{ id: number; checked: boolean }> = []; // 选择的数据显示
  disabledButton = true; // 操作按钮的可用显示状态
  checkedNumber = 0; // 已选择的行数量
  operating = false; // 操作loading状态

  status = 'true'; // 组合sku状态：ALL:全部，true：启用，false：停用
  search = '';  // 搜索值
  pageSize = 20;  // 默认一页显示条数
  totalCount = 0;  // 组合sku总数

  // 自定义显示{是否显示，字段名，显示名称，是否禁用}
  display = [
    {show: true, model_name: 'combo_code', list_name: '组合sku/名称', disabled: true},
    {show: true, model_name: 'skus', list_name: '商品信息', disabled: true},
    {show: true, model_name: 'combo_cost', list_name: '组合成本', disabled: false},
    {show: true, model_name: 'combo_weight', list_name: '组合重量', disabled: false},
    {show: false, model_name: 'create_time', list_name: '创建时间', disabled: false},
    {show: true, model_name: 'status', list_name: '状态', disabled: false},
  ];

  constructor(private productService: ProductService,
              private message: NzMessageService,
              private modalService: NzModalService) { }

  ngOnInit() {

    // 取出本地存储自定义设置信息
    const display_setting = localStorage.getItem('combo_list_display');
    if (display_setting && display_setting !== 'undefined' && display_setting !== 'null') {
      this.display = JSON.parse(display_setting);
    }

    // 向服务器获取供应商列表数据
    this.operating = true;
    const urlparams = new URLSearchParams();
    urlparams.append('combo_status', this.status);
    urlparams.append('page_size', this.pageSize.toString());

    this.productService.getCombopacks(urlparams.toString()).subscribe(
      val => {
        this.combo = val.results;
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
    this.disabledButton = !this.combo.some(value => value.checked);
    this.checkedNumber = this.combo.filter(value => value.checked).length;
  }

  // 操作数据
  operateData(): void {
    this.operating = true;
    setTimeout(_ => {
      this.combo.forEach(value => {
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

  // 处理显示列表字段状态
  checkDisplay(model_name: string): boolean {
    const dp = this.display.filter(disp => disp.model_name === model_name);
    return dp[0].show;
  }

  // 自定义显示设置
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
        localStorage.setItem('combo_list_display', JSON.stringify(result.data));
        this.display = result.data;
        console.log(this.display);
      }
    });

  }


  /**
   * 获取组合sku列表数据（供调用）
   * */
  getCombos(params) {
    this.operating = true;
    this.productService.getCombopacks(params).subscribe(
      val => {
        this.combo = val.results;
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
    localStorage.setItem('combo_list_pagesize', pageSize)
    console.log(pageSize);

    const urlparams = new URLSearchParams();
    if (this.status !== 'ALL') {
      urlparams.append('combo_status', this.status);
    }
    urlparams.append('page_size', pageSize.toString());
    if (this.search) {
      urlparams.append('search', this.search);
    }

    this.getCombos(urlparams);


  }

  /**
   * 页码改变回调
   * */
  pageIndexChange(page) {
    const urlparams = new URLSearchParams();
    if (this.status !== 'ALL') {
      urlparams.append('combo_status', this.status);
    }
    urlparams.append('page_size', this.pageSize.toString());
    if (this.search) {
      urlparams.append('search', this.search);
    }
    urlparams.append('page', page);

    this.getCombos(urlparams);
  }

  /**
   * 组合sku筛选、搜索
   * */
  listFilter() {
    const urlparams = new URLSearchParams();
    if (this.status !== 'ALL') {
      urlparams.append('combo_status', this.status);
    }
    urlparams.append('page_size', this.pageSize.toString());
    if (this.search) {
      urlparams.append('search', this.search);
    }
    this.getCombos(urlparams);
  }

  /**
   * 编辑组合sku
   * */
  editCombo(id: number): void {
    const modal = this.modalService.create({
      nzTitle: '编辑组合',
      nzMaskClosable: false,
      nzClosable: true,
      nzWidth: '900px',
      nzContent: ComboAddComponent,
      nzComponentParams: {
        combo: this.combo.find((cob => cob.id === id)),
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
      }
    });

  }

  /**
   * 添加组合sku
   * */
  addCombo(): void {
    const modal = this.modalService.create({
      nzTitle: '新建组合',
      nzMaskClosable: false,
      nzClosable: true,
      nzWidth: '900px',
      nzContent: ComboNewaddComponent,

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
      }
    });

  }

  /**
   * 启用/停用组合
   * */
  changeStatus(id: number, status: boolean) {
    this.combo.forEach(value => {
      if (value.id === id) {
        value.checked = true;
      } else {
        value.checked = false;
      }
    });
    this.bulkChangeStatus(!status);
  }

  /**
   * 批量启用/停用组合
   * */
  bulkChangeStatus(status: boolean) {
    const ids = [];
    this.combo.forEach(value => {
      if (value.checked) {
        ids.push(value.id);
      }
      value.checked = false;
    });

    this.operating = true;
    this.productService.bulkChangeCombopackStatus({'ids': ids, 'combo_status': status}).subscribe(
      val => {
        if (val.status === 200) {
          this.message.create('success', !status ? '组合已停用！' : '组合已启用！');
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
    this.refreshStatus();
  }

  /**
   * 删除组合
   * */
  deleteConfirm(id): void {
    this.modalService.confirm({
      nzTitle: '<i>是否确认要删除?</i>',
      nzContent: '<b>一旦删除将无法恢复</b>',
      nzOnOk: () => {
        this.operating = true;

        if (id) {  // 单个删除
          this.productService.deleteCombopack(id).subscribe(
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
          this.combo.forEach(value => {
            if (value.checked) {
              ids.push(value.id);
            }
            value.checked = false;
          });
          console.log(ids);
          this.productService.bulkDeleteCombopack(ids).subscribe(
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

}
