import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Position, WarehouseService} from '../../../shared/warehouse.service';
import {NzModalRef} from 'ng-zorro-antd';

@Component({
  selector: 'app-position-add',
  templateUrl: './position-add.component.html',
  styleUrls: ['./position-add.component.css']
})
export class PositionAddComponent implements OnInit {

  @Input() id: number;
  position = [];

  allChecked = false; // 全选状态
  indeterminate = false; // 选择框的不确定状态
  displayData: Array<{ id: number; checked: boolean }> = []; // 选择的数据显示
  disabledButton = true; // 操作按钮的可用显示状态
  checkedNumber = 0; // 已选择的行数量
  operating = false; // 操作状态
  pageSize = 20;  // 默认一页显示条数
  totalCount = 0;  // 供应商总数
  head = ''; // 前缀
  col: number; // 列
  connect = '-'; // 连接符
  row: number; // 层
  alert_status = false;

  constructor(private warehouseService: WarehouseService,
              private fb: FormBuilder,
              private modal: NzModalRef) { }

  ngOnInit() {
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
   * 测试输入有效性
   * */
  numValidator(num: any, max: number): boolean {
    const REGEXP = /^\d{1,3}$/;
    if (!num) {
      return false;
    } else if (REGEXP.test(num)) {
      if (num < max + 1) {
        return true;
      } else {
        return false;
      }
    }
  }

  /**
   * 生成仓位
   * */
  generatePosition() {
    if (this.numValidator(this.col, 99) && this.numValidator(this.row, 22)) {
      for (let i = 0; i < this.col; i++) {
        const num = i + 1;
        const co = num > 9 ? num : '0' + num;
        for (let n = 0; n < this.row; n++) {
          const num2 = n + 1;
          const co2 = num2 > 9 ? num2 : '0' + num2;
          const p = new Position(
            'L' + num + num2,
            this.head + co + this.connect + co2,
            num,
            num2
          );
          this.position = [ ...this.position, p ];
        }
      }
      this.head = '';
      this.col = null;
      this.row = null;
      this.alert_status = false;
    } else {
      this.alert_status = true;
    }
  }

  /**
   * 删除
   * */
  deletePosition(i) {
    const dataSet = this.position.filter(d => d.id !== i);
    this.position = dataSet;
  }

  /**
   * 批量删除
   * */
  bulkDeletePosition() {
    this.position.forEach(value => {
      if (value.checked) {
        const dataSet = this.position.filter(d => d.id !== value.id);
        this.position = dataSet;
      }
      value.checked = false;
    });
  }

  /**
   * 提交
   * */
  destroyModal() {
    const codes = [];
    this.position.forEach(value => {
      if (value.po_code) {
        codes.push(value.po_code);
      }
    });

    this.operating = true;
    this.warehouseService.addPosition({
      wh_id: this.id,
      codes: codes
    }).subscribe(
      val => {
        if (val.status === 201) {
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
