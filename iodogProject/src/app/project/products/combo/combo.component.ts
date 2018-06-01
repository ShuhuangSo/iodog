import { Component, OnInit } from '@angular/core';
import {Combo, ComboInsideSKU, ProductService} from '../../../shared/product.service';
import {NzModalService} from 'ng-zorro-antd';
import {ListDisplaySettingComponent} from '../../list-display-setting/list-display-setting.component';

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
              private modalService: NzModalService) { }

  ngOnInit() {
    this.combo = this.productService.getCombo();

    // 取出本地存储自定义设置信息
    const display_setting = localStorage.getItem('combo_list_display');
    if (display_setting && display_setting !== 'undefined' && display_setting !== 'null') {
      this.display = JSON.parse(display_setting);
    }
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

}
