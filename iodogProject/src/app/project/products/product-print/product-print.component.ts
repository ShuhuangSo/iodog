import {Component, Input, OnInit} from '@angular/core';
import {NzModalRef} from 'ng-zorro-antd';
import {ProductService} from '../../../shared/product.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-product-print',
  templateUrl: './product-print.component.html',
  styleUrls: ['./product-print.component.css']
})
export class ProductPrintComponent implements OnInit {
  @Input() sku_list: any;

  isSpinning = false; // 加载状态
  formModel: FormGroup;

  constructor(private productService: ProductService,
              private fb: FormBuilder,
              private modal: NzModalRef) { }

  ngOnInit() {
    this.formModel = this.fb.group({
      print_qty: ['', [Validators.required]],
      label_from: ['winit', [Validators.required]],
      label_type: ['LZ6040', [Validators.required]],
      made_in: ['China', [Validators.required]],
    });
  }

  setQty(qty): void {
    this.formModel.patchValue({'print_qty' : qty});
  }

  /**
   * 打印产品标签
   * */
  print(): void {
    if (this.formModel.valid) {
      const data = []
      const sku_items = []
      this.sku_list.forEach(value => {
        sku_items.push(
          {
            'productCode': value,
            'specification': '',
            'printQty': this.formModel.value['print_qty']
          }
        );
      });
      data.push({'singleItems': sku_items});
      data.push({'labelType': this.formModel.value['label_type']});
      const made_in = this.formModel.value['made_in']
      data.push({'madeIn': made_in});

      this.isSpinning = true;
      this.productService.printProduct(data).subscribe(
        val => {
          if (val.status === 200) {
            window.open(val.body, '_blank');
          } else {
            console.log(val);
          }
        },
        err => {
          console.log(err);
          this.isSpinning = false
        },
        () => this.isSpinning = false
      );

    } else {
      for (const key in this.formModel.controls) {
        this.formModel.controls[key].markAsDirty();
        this.formModel.controls[key].updateValueAndValidity();
      }
    }
  }

}
