import {Component, Input, OnInit} from '@angular/core';
import {ProductService} from '../../../shared/product.service';
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

  formModel: FormGroup;
  image: string; // 产品图片
  cn_name: string; // 产品名称

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
  }

  // 获取FormControl
  getFormControl(name) {
    return this.formModel.controls[ name ];
  }

  /**
   * 异步校验sku是否存在
   * */
  check_SkuAsyncValidator = (control: FormControl) => Observable.create((observer) => {
    this.show_info = false;
    setTimeout(() => {
      this.productService.checkSKU(control.value).subscribe(
        value => {
          if (value.status !== 200) {
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

  destroyModal(): void {
    if (this.formModel.valid) {
      console.log(this.formModel.value)
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
    } else {
      for (const key in this.formModel.controls) {
        this.formModel.controls[key].markAsDirty();
        this.formModel.controls[key].updateValueAndValidity();
      }
    }
  }

}
