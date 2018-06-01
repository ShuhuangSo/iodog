import { Component, OnInit } from '@angular/core';
import {Combo, ComboInsideSKU, ProductService} from '../../../shared/product.service';
import {NzModalService} from 'ng-zorro-antd';

@Component({
  selector: 'app-combo',
  templateUrl: './combo.component.html',
  styleUrls: ['./combo.component.css']
})
export class ComboComponent implements OnInit {
  combo: Combo [];
  combo_inside_sku: ComboInsideSKU [];

  allChecked = false; // 全选状态
  indeterminate = false; // 选择框的不确定状态
  displayData: Array<{ id: number; checked: boolean }> = []; // 选择的数据显示
  disabledButton = true; // 操作按钮的可用显示状态
  checkedNumber = 0; // 已选择的行数量
  operating = false; // 操作loading状态

  constructor(private productService: ProductService,
              private modalService: NzModalService) { }

  ngOnInit() {
    this.combo = this.productService.getCombo();
    this.combo_inside_sku = this.productService.getComboInsideSKU();
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

}
