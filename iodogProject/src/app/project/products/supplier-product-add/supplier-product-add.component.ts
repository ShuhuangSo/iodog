import {Component, Input, OnInit} from '@angular/core';
import {ProductService, SupplierProduct} from '../../../shared/product.service';
import {NzModalRef, NzModalService} from 'ng-zorro-antd';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ProductSearchComponent} from '../product-search/product-search.component';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-supplier-product-add',
  templateUrl: './supplier-product-add.component.html',
  styleUrls: ['./supplier-product-add.component.css']
})
export class SupplierProductAddComponent implements OnInit {
  @Input() mode: string;
  @Input() supplier_id: number;
  @Input() sup_product_id: number;
  @Input() sku: string;

  supplierProduct: SupplierProduct

  formModel: FormGroup;
  image: string; // 产品图片
  cn_name: string; // 产品名称
  err_msg: string; // 错误信息

  operating = false; // 操作loading状态
  show_info =  false; // 显示sku其它信息状态

  constructor(
    private productService: ProductService,
    private modalService: NzModalService,
    private modal: NzModalRef,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    if (this.mode === 'ADD') {
      // 新增关联产品
      this.formModel = this.fb.group({
        sku: ['', [Validators.required, Validators.maxLength(30)], [this.check_SkuAsyncValidator]],
        buy_url: ['', [Validators.maxLength(300)]],
        product: [''],
        supplier: [this.supplier_id]
      });
    }

    if (this.mode === 'EDIT') {
      // 编辑关联产品
      this.formModel = this.fb.group({
        buy_url: ['', [Validators.maxLength(300)]],
        id: [this.sup_product_id]
      });

      this.operating = true;
      this.productService.getSupplierProductsById(this.sup_product_id).subscribe(
        val => {
          this.supplierProduct = val;
        },
        err => {
          console.log(err)
          this.operating = false;
        },
        () => {
          // 表单初始化
          this.formModel.patchValue(this.supplierProduct);
          this.operating = false;
        }
      );
    }



  }

  // 获取FormControl
  getFormControl(name) {
    return this.formModel.controls[ name ];
  }

  /**
   * 异步校验sku是否存在,是否已关联到供应商
   * */
  check_SkuAsyncValidator = (control: FormControl) => Observable.create((observer) => {
    this.show_info = false;
    setTimeout(() => {
      this.productService.checkSKU({'sku': control.value, 'supplier': this.supplier_id}).subscribe(
        value => {
          if (value.status === 200) {
            this.err_msg = value.body.msg;
            observer.next({ error: true, not_exist: true });
          } else {
            observer.next(null);
            this.show_info = true;
          }
        },
        err => console.log(err),
        () => observer.complete()
      );
    }, 500);

  })

  /**
   * 查找产品
   * */
  searchProduct(): void {
    const modal = this.modalService.create({
      nzTitle: '快速添加产品',
      nzMaskClosable: false,
      nzClosable: true,
      nzWidth: '800px',
      nzContent: ProductSearchComponent,

      nzFooter: [
        {
          label: '取消',
          shape: 'default',
          onClick: () => modal.destroy()
        },
        {
          label: '确认',
          type: 'primary',
          loading: ((componentInstance) => {
            return componentInstance.isSpinning;
          }),
          onClick: (componentInstance) => {
            componentInstance.destroyModal();
          }
        },
      ]
    });

    // 模态框返回数据
    modal.afterClose.subscribe((result) => {
      if (result) {
        this.formModel.patchValue({sku: result.sku, product: result.id});
        this.image = result.image;
        this.cn_name = result.cn_name;
        this.show_info = true;
      }
    });

  }

  /**
   * 新增
   * */
  addFunc(): void {
    this.operating = true;
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
        this.operating = false
      },
      () => this.operating = false
    );
  }

  /**
   * 修改
   * */
  editFunc(): void {
    this.operating = true;
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
        this.operating = false;
      },
      () => this.operating = false
    );
  }

  destroyModal(): void {
    if (this.formModel.valid) {
      if (this.mode === 'ADD') {
        this.addFunc();
      } else {
        this.editFunc();
      }
    } else {
      for (const key in this.formModel.controls) {
        this.formModel.controls[key].markAsDirty();
        this.formModel.controls[key].updateValueAndValidity();
      }
    }
  }

}
