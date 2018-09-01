import {Component, Input, OnInit} from '@angular/core';
import {Warehouse, WarehouseService} from '../../../shared/warehouse.service';
import {NzModalRef} from 'ng-zorro-antd';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-warehouse-add',
  templateUrl: './warehouse-add.component.html',
  styleUrls: ['./warehouse-add.component.css']
})
export class WarehouseAddComponent implements OnInit {
  warehouse: Warehouse[];
  formModel: FormGroup;
  @Input() mode: string;
  @Input() wh: Warehouse;

  operating = false; // 操作状态
  pageSize = 20;  // 默认一页显示条数
  totalCount = 0;  // 供应商总数
  logis = []; // 物流公司
  logistics_company = ''

  constructor(private warehouseService: WarehouseService,
              private fb: FormBuilder,
              private modal: NzModalRef) { }

  ngOnInit() {
    if (this.mode === 'ADD') {
      const urlparams = new URLSearchParams();
      urlparams.append('page_size', this.pageSize.toString());
      this.getWarehouse(urlparams.toString());
    }
    if (this.mode === 'EDIT') {
      this.formModel = this.fb.group({
        id: [this.wh.id],
        return_name: [this.wh.return_name, [Validators.maxLength(80)]],
        return_phone: [this.wh.return_phone, [Validators.maxLength(30)]],
        return_address: [this.wh.return_address, [Validators.maxLength(200)]],
        post_name: [this.wh.post_name, [Validators.maxLength(80)]],
        post_phone: [this.wh.post_phone, [Validators.maxLength(30)]],
        post_address: [this.wh.post_address, [Validators.maxLength(200)]]
      });
    }
  }

  /**
   * 获取列表数据（供调用）
   * */
  getWarehouse(params) {
    this.operating = true;
    this.warehouseService.getSettingWarehouse(params).subscribe(
      val => {
        this.warehouse = val.results;
        this.totalCount = val.count;

      },
      err => {
        console.log(err);
        this.operating = false;
      },
      () => {
        // 加物流公司列表
        this.warehouse.forEach(value => {
          if (this.logis.indexOf(value.logistics_company) === -1) {
            this.logis.push(value.logistics_company);
          }
        });
        this.operating = false;
      }
    );
  }

  /**
   * 页码改变回调
   * */
  pageIndexChange(page) {
    const urlparams = new URLSearchParams();
    urlparams.append('page_size', this.pageSize.toString());
    urlparams.append('page', page);

    this.getWarehouse(urlparams);
  }

  /**
   * 每页显示条数改变回调
   * */
  pageSizeChange(pageSize) {

    const urlparams = new URLSearchParams();
    urlparams.append('page_size', pageSize.toString());

    this.getWarehouse(urlparams);
  }

  /**
   * 物流公司数据筛选
   * */
  listFilter() {
    const urlparams = new URLSearchParams();
    urlparams.append('page_size', this.pageSize.toString());
    if (this.logistics_company) {
      urlparams.append('logistics_company', this.logistics_company);
    }
    this.getWarehouse(urlparams);
  }

  /**
   * 选中仓库
   * */
  chooseWarehouse(id) {
    this.operating = true;
    this.warehouseService.addWarehouse({id: id}).subscribe(
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

  /**
   * 提交修改
   * */
  destroyModal() {
    if (this.formModel.valid) {
      this.operating = true;
      this.warehouseService.updateWarehouse(this.formModel.value).subscribe(
        val => {
          if (val.status === 200) {
            this.operating = false;
            this.modal.destroy({data: 'ok'});
          }
        },
        err => {
          console.log(err)
          this.operating = false;
        }
      );
    } else {
      for (const key in this.formModel.controls) {
        this.formModel.controls[ key ].markAsDirty();
        this.formModel.controls[ key ].updateValueAndValidity();
      }

    }
    this.modal.destroy({data: 'ok'});
  }

}
