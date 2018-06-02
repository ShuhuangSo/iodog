import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-supplier-add',
  templateUrl: './supplier-add.component.html',
  styleUrls: ['./supplier-add.component.css']
})
export class SupplierAddComponent implements OnInit {
  formModel: FormGroup;
  isSpinning = false; // 加载状态

  constructor(private modal: NzModalRef,
              private message: NzMessageService,
              fb: FormBuilder) {
    this.formModel = fb.group({
      supplier_name: ['', [Validators.required, Validators.maxLength(30)], [this.supplierNameAsyncValidator]],
      buy_way: ['阿里1688'],
      store_url: [''],
      address: [''],
      qq: [''],
      phone: [''],
      note: ['']
    });
  }

  ngOnInit() {
  }

  // 获取FormControl
  getFormControl(name) {
    return this.formModel.controls[ name ];
  }

  // 异步校验供应商名称
  supplierNameAsyncValidator = (control: FormControl): any => {
    return Observable.create(function (observer) {
      setTimeout(() => {
        if (control.value === '东涛') {
          observer.next({ error: true, duplicated: true });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 1000);
    });
  }

  // 确认提交
  destroyModal(): void {
    this.isSpinning = true;
    setTimeout(() => {
      if (this.formModel.valid) {

        this.modal.destroy({ data: 123 });
        console.log(this.formModel.value);
        this.message.create('success', '供应商添加成功！');
      } else {
        for (const key in this.formModel.controls) {
          this.formModel.controls[ key ].markAsDirty();
          this.formModel.controls[ key ].updateValueAndValidity();
        }

      }
      this.isSpinning = false;
    }, 3000);

  }

}
