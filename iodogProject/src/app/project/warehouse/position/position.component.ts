import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Position, WarehouseService} from '../../../shared/warehouse.service';
import {NzModalRef, NzModalService} from 'ng-zorro-antd';
import {PositionAddComponent} from '../position-add/position-add.component';

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.css']
})
export class PositionComponent implements OnInit {
  @Input() id: number;
  position = [];

  allChecked = false; // 全选状态
  indeterminate = false; // 选择框的不确定状态
  displayData: Array<{ id: number; checked: boolean }> = []; // 选择的数据显示
  disabledButton = true; // 操作按钮的可用显示状态
  checkedNumber = 0; // 已选择的行数量
  operating = false; // 操作状态
  pageSize = 100;  // 默认一页显示条数
  page = 1; // 默认页面
  totalCount = 0;  // 总数

  is_active = ''
  edit_status = false; // 编辑状态
  delete_list = []; // 删除id列表

  constructor(private warehouseService: WarehouseService,
              private modalService: NzModalService,
              private fb: FormBuilder,
              private modal: NzModalRef) { }

  ngOnInit() {
    this.listFilter();
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
    this.disabledButton = !this.position.some(value => value.checked);
    this.checkedNumber = this.position.filter(value => value.checked).length;
  }

  // 数据改变回调
  currentPageDataChange($event: Array<{ id: number; checked: boolean }>): void {
    this.displayData = $event;
  }

  /**
   * 获取列表数据
   * */
  listFilter() {
    const urlparams = new URLSearchParams();
    urlparams.append('page_size', this.pageSize.toString());
    urlparams.append('page', this.page.toString());
    urlparams.append('warehouse', this.id.toString());
    if (this.is_active !== '') {
      urlparams.append('is_active', this.is_active);
    }
    this.getPosition(urlparams.toString());
  }

  /**
   * 获取列表数据（供调用）
   * */
  getPosition(params) {
    this.operating = true;
    this.warehouseService.getPosition(params).subscribe(
      val => {
        this.position = val.results;
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
   * 每页显示条数改变回调
   * */
  pageSizeChange(pageSize) {
    this.pageSize = pageSize;
    this.listFilter();

  }

  /**
   * 页码改变回调
   * */
  pageIndexChange(page) {
    this.page = page;
    this.listFilter();
  }

  /**
   * 修改仓位状态
   * */
  changeStatus(status, id) {
    this.warehouseService.updatePositionStatus({is_active: !status, id: id}).subscribe(
      val => {
        if (val.status === 200) {
          this.listFilter();
        }

      },
      err => {
        console.log(err);
      },
    );
  }

  /**
   * 批量启用/停用修改仓位状态
   * */
  bulkChangeStatus(status: boolean) {
    const ids = [];
    this.position.forEach(value => {
      if (value.checked) {
        ids.push(value.id);
      }
      value.checked = false;
    })
    this.operating = true;
    this.warehouseService.bulkUpdatePositionStatus({wh_id: this.id, is_active: status, ids: ids}).subscribe(
      val => {
        if (val.status === 200) {
          this.listFilter(); // 刷新数据
        }
      },
      err => {
        console.log(err)
        this.operating = false;
      });
  }

  /**
   * 删除
   * */
  deletePosition(i) {
    const dataSet = this.position.filter(d => d.id !== i);
    this.position = dataSet;
    this.delete_list.push(i);
  }

  /**
   * 批量删除
   * */
  bulkDeletePosition() {
    this.position.forEach(value => {
      if (value.checked) {
        const dataSet = this.position.filter(d => d.id !== value.id);
        this.position = dataSet;
        this.delete_list.push(value.id);
      }
      value.checked = false;
    });
  }

  /**
   * 添加仓位
   * */
  addPosition(id): void {
    const modal = this.modalService.create({
      nzTitle: `添加仓位`,
      nzMaskClosable: false,
      nzClosable: true,
      nzWidth: '1000px',
      nzStyle: {top: '20px'},
      nzContent: PositionAddComponent,
      nzComponentParams: {
        id: id
      },
      nzFooter: [
        {
          label: '关闭',
          shape: 'default',
          onClick: () => modal.destroy()
        },
        {
          label: '保存',
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

  /**
   * 提交
   * */
  destroyModal() {
    this.operating = true;
    this.warehouseService.updatePosition({
      wh_id: this.id,
      delete_list: this.delete_list,
      position: this.position
    }).subscribe(
      val => {
        if (val.status === 200) {
          this.modal.destroy({data: 'ok'});
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

}
