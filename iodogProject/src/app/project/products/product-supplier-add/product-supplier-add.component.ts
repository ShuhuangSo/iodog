import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzModalRef} from 'ng-zorro-antd';
import {ProductService} from '../../../shared/product.service';

@Component({
  selector: 'app-product-supplier-add',
  templateUrl: './product-supplier-add.component.html',
  styleUrls: ['./product-supplier-add.component.css']
})
export class ProductSupplierAddComponent implements OnInit {
  formModel: FormGroup;
  isSpinning = false; // 窗口加载状态

  optionList = []; // 供应商选择列表
  isLoading = false; // 供应商选择列表加载状态


  @Input()
  productId: number;

  @Input()
  product_supplier: any;

  constructor(private modal: NzModalRef,
              private fb: FormBuilder,
              private productService: ProductService) { }

  ngOnInit() {
    this.formModel = this.fb.group({
      supplier: ['', [Validators.required]],
      buy_url: [''],
      product: [this.productId],
    });

    this.isLoading = true;
    const urlparams = new URLSearchParams();
    urlparams.append('status', 'true');
    this.getSupplier(urlparams.toString());
  }

  /**
   * 检查供应商是否已绑定
   * */
  checkSupplier(value: string): boolean {
    if (this.product_supplier) {
      for (let sup of this.product_supplier) {
        if (sup.supplier === value) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * 搜索供应商
   * */
  onSearch(value: string): void {
    this.isLoading = true;
    const urlparams = new URLSearchParams();
    urlparams.append('status', 'true');
    urlparams.append('search', value);
    this.getSupplier(urlparams.toString());
  }

  /**
   * 获取供应商
   * */
  getSupplier(urlparams: string) {
    // 向服务器获取供应商列表数据
    this.productService.getSuppliers(urlparams).subscribe(
      val => {
        this.optionList = val.results;
        this.isLoading = false;
      },
      err => {
        console.log(err)
        this.isLoading = false;
      },
      () => this.isLoading = false
    );
  }

  // 确认提交
  destroyModal(): void {
    // 提交保存关联供应商
    if (this.formModel.valid) {
      this.isSpinning = true;
      this.productService.addSupplierProduct(this.formModel.value).subscribe(
        val => {
          if (val.status === 201) {
            this.modal.destroy({ data: 'ok' });
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
        this.formModel.controls[ key ].markAsDirty();
        this.formModel.controls[ key ].updateValueAndValidity();
      }
    }
  }

}
