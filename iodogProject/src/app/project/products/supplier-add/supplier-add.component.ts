import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {Observable} from 'rxjs/Observable';
import {ProductService, Supplier} from '../../../shared/product.service';

@Component({
  selector: 'app-supplier-add',
  templateUrl: './supplier-add.component.html',
  styleUrls: ['./supplier-add.component.css']
})
export class SupplierAddComponent implements OnInit {
  formModel: FormGroup;
  isSpinning = false; // 加载状态


  @Input()
  supplier: Supplier;

  constructor(private modal: NzModalRef,
              private productService: ProductService,
              private message: NzMessageService,
              private fb: FormBuilder
              ) {
  }

  ngOnInit() {
    if (!this.supplier) {
      // 新增供应商
      this.formModel = this.fb.group({
        supplier_name: ['', [Validators.required, Validators.maxLength(30)], [this.supplierNameAsyncValidator]],
        buy_way: ['阿里1688'],
        store_url: [''],
        address: [''],
        qq: [''],
        phone: [''],
        note: ['']
      });
    } else {
      // 修改供应商
      this.formModel = this.fb.group({
        id: [this.supplier.id],
        supplier_name: [this.supplier.supplier_name, [Validators.required, Validators.maxLength(30)], [this.supplierNameAsyncValidator]],
        buy_way: [this.supplier.buy_way],
        store_url: [this.supplier.store_url],
        address: [this.supplier.address],
        qq: [this.supplier.qq],
        phone: [this.supplier.phone],
        note: [this.supplier.note],
        status: [this.supplier.status],
      });
    }
  }

  // 获取FormControl
  getFormControl(name) {
    return this.formModel.controls[ name ];
  }

  // 异步校验供应商名称
  supplierNameAsyncValidator = (control: FormControl) => Observable.create((observer) => {
    setTimeout(() => {
      this.productService.checkSupplier(control.value).subscribe(
        value => {
          console.log(value.status);
          if (value.status === 200) {
            observer.next({ error: true, duplicated: true });
          } else {
            observer.next(null);
          }
        },
        err => console.log(err),
        () => observer.complete()
      );
    }, 500);

  })

  // 确认提交
  destroyModal(): void {
    this.isSpinning = true;

      if (this.formModel.valid) {
        // 新增供应商
        if (!this.supplier) {
          this.productService.addSupplier(this.formModel.value).subscribe(
            val => {
              console.log(val.statusText);
              if (val.status === 201) {
                this.isSpinning = false;
                this.message.create('success', '供应商添加成功！');
                this.modal.destroy({ data: 'ok' });
              } else {
                this.message.create('error', `请求异常 ${val.statusText}`);
                this.isSpinning = false;
              }
            },
            err => {
              this.message.create('error', `请求异常 ${err.statusText}`);
              this.isSpinning = false;
            }
          );
        } else {
          // 修改供应商
          this.productService.updateSupplier(this.formModel.value).subscribe(
            val => {
              console.log(val.status);
              if (val.status === 200) {
                this.isSpinning = false;
                this.message.create('success', '供应商修改成功！');
                this.modal.destroy({data: 'ok'});
              } else {
                this.message.create('error', `请求异常 ${val.statusText}`);
                this.isSpinning = false;
              }
            },
            err => {
              this.message.create('error', `请求异常 ${err.statusText}`);
              this.isSpinning = false;
            }
          );
        }

      } else {
        for (const key in this.formModel.controls) {
          this.formModel.controls[ key ].markAsDirty();
          this.formModel.controls[ key ].updateValueAndValidity();
        }

      }



  }

}
