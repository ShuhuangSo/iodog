import {Component, Input, OnInit} from '@angular/core';
import {ProductService} from '../../../shared/product.service';
import {NzModalRef} from 'ng-zorro-antd';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-product-bulk-edit',
  templateUrl: './product-bulk-edit.component.html',
  styleUrls: ['./product-bulk-edit.component.css']
})
export class ProductBulkEditComponent implements OnInit {
  isSpinning = false; // 加载状态
  formModel: FormGroup;

  @Input()
  ids: number[];

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private modal: NzModalRef
  ) { }

  ngOnInit() {
    this.formModel = this.fb.group({
      ids: [this.ids],
      status: ['', [Validators.required]],
    });
  }

  /**
   * 本窗口确认提交
   * */
  destroyModal(): void {
    console.log(this.formModel.value)
    if (this.formModel.valid) {
      this.isSpinning = true;
      this.productService.bulkEditProduct(this.formModel.value).subscribe(
        val => {
          if (val.status === 200) {
            this.isSpinning = false;
            this.modal.destroy({ data: 'ok' });
          }
        },
        err => {
          console.log(err);
          this.isSpinning = false;
        });
    } else {
      for (const key in this.formModel.controls) {
        this.formModel.controls[ key ].markAsDirty();
        this.formModel.controls[ key ].updateValueAndValidity();
      }
    }
  }

}
