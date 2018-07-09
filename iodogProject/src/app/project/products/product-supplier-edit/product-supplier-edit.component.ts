import {Component, Input, OnInit} from '@angular/core';
import {NzModalRef} from 'ng-zorro-antd';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ProductService} from '../../../shared/product.service';

@Component({
  selector: 'app-product-supplier-edit',
  templateUrl: './product-supplier-edit.component.html',
  styleUrls: ['./product-supplier-edit.component.css']
})
export class ProductSupplierEditComponent implements OnInit {
  formModel: FormGroup;
  isSpinning = false; // 窗口加载状态

  @Input()
  product_supplier: any;

  constructor(private modal: NzModalRef,
              private fb: FormBuilder,
              private productService: ProductService) { }

  ngOnInit() {
    this.formModel = this.fb.group({
      id: [this.product_supplier.id],
      buy_url: [this.product_supplier.buy_url],
    });
  }

  // 确认提交
  destroyModal(): void {
    // 提交编辑关联供应商
    if (this.formModel.valid) {
      this.isSpinning = true;
      this.productService.updateSupplierProduct(this.formModel.value).subscribe(
        val => {
          if (val.status === 200) {
            this.modal.destroy({ data: 'ok' });
          } else {
            console.log(val);
          }
        },
        err => {
          console.log(err);
          this.isSpinning = false;
        },
        () => this.isSpinning = false
      );
    } else {
      for (const key in this.formModel.controls) {
        this.formModel.controls[ key ].markAsDirty();
        this.formModel.controls[ key ].updateValueAndValidity();
      }
    }
  }

}
