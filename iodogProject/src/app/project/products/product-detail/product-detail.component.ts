import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService, NzModalRef, NzModalService} from 'ng-zorro-antd';
import {AddCountryComponent} from '../add-country/add-country.component';
import {sliceName} from '../../../utils/tools';
import {Product, ProductService} from '../../../shared/product.service';
import {ProductSupplierAddComponent} from '../product-supplier-add/product-supplier-add.component';
import {ProductSupplierEditComponent} from '../product-supplier-edit/product-supplier-edit.component';
import {priceValidator} from '../../../utils/validators';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  formModel: FormGroup;
  isSpinning = false; // 加载状态
  product: Product;
  remove_id = 0; // 默认供应商id

  @Input()
  productId: number;

  // 虚拟sku数据列表
  tags = [];
  vskus = []; // 初始虚拟sku数据
  add_vsku = []; // 增加的虚拟sku
  remove_vsku = []; // 删除的vsku
  inputVisible = false;
  inputValue = '';
  vsku_err_status = false; // 虚拟sku错误显示状态
  vsku_loading = false; // 虚拟sku输入loading状态
  @ViewChild('inputElement') inputElement: ElementRef;


  constructor(
              private productService: ProductService,
              private fb: FormBuilder,
              private modal: NzModalRef,
              private message: NzMessageService,
              private modalService: NzModalService) {}

  ngOnInit() {
    this.formModel = this.fb.group({
      id: [this.productId],
      cn_name: ['', [Validators.required, Validators.maxLength(30)]],
      status: [''],
      cost: ['', [Validators.required, priceValidator]],
      en_name: ['', [Validators.maxLength(80)]],
      declared_value: ['', [priceValidator]],
      url: ['', [Validators.maxLength(200)]],
      length: ['', [priceValidator]],
      width: ['', [priceValidator]],
      heigth: ['', [priceValidator]],
      weight: ['', [priceValidator]],
      is_battery: [false],
      is_jack: [false],
      is_brand: [false],
      brand_name: ['', [Validators.maxLength(20)]],
      brand_model: ['', [Validators.maxLength(20)]],
      add_vsku: [this.add_vsku],
      remove_vsku: [this.remove_vsku]
    });

    this.isSpinning = true;
    this.productService.getProductById(this.productId).subscribe(
      val => {
        this.product = val;
      },
      err => {
        this.message.create('error', `请求异常 ${err.statusText}`);
        this.isSpinning = false;
      },
      () => {
        // 表单初始化
        this.formModel.patchValue(this.product);
        // 虚拟sku赋值
        for (let vs of this.product.product_vsku) {
          this.tags.push(vs.vsku);
          this.vskus.push(vs.vsku);
        }
        this.isSpinning = false
      }
    );


  }

  // 获取FormControl
  getFormControl(name) {
    return this.formModel.controls[ name ];
  }

  submitForm() {
    console.log(this.formModel.value);
  }


  // 截取长文字
  sliceTagName(tag: string): string {
    return sliceName(tag, 20);
  }

  // 删除标签
  handleClose(removedTag: {}): void {
    this.tags = this.tags.filter(tag => tag !== removedTag);
  }

  // 显示输入框
  showInput(): void {
    this.inputVisible = true;
    setTimeout(() => {
      this.inputElement.nativeElement.focus();
    }, 10);
  }

  // 输入回车确认
  handleInputConfirm(): void {
    if (this.inputValue) {
      this.vsku_loading = true;
      this.productService.checkVsku(this.inputValue).subscribe(
        val => {
          if (val.status === 200 || this.tags.indexOf(this.inputValue) !== -1) {
            this.vsku_err_status = true;
          } else {
            this.tags.push(this.inputValue); // 加入页面显示
            this.inputVisible = false;
            this.vsku_err_status = false;
          }
          this.inputValue = '';
        },
        err => {
          console.log(err);
        },
        () => this.vsku_loading = false
      );
    } else {
      this.vsku_err_status = false;
      this.inputVisible = false;
    }

  }

  /**
   * 获取虚拟sku的删除和增加
   * */
  checkVsku() {
    // 获取删除的虚拟sku
    for (let vs of this.product.product_vsku) {
      // 如果vs.sku不在tags中，说明该虚拟sku被删除
      if (this.tags.indexOf(vs.vsku) === -1) {
        this.remove_vsku.push(vs.vsku);
      }
    }
    // 获取增加的虚拟sku
    for (let tag of this.tags) {
      // 如果tag不在vsku中，说明该虚拟sku是新增加
      if (this.vskus.indexOf(tag) === -1) {
        this.add_vsku.push(tag);
      }
    }
  }

  /**
   * 增加注册国家
   * */
  addCountry(): void {
    const reg_country = []; // 获取当天注册国家数据
    if (this.product.product_reg_product) {
      for (let r of this.product.product_reg_product) {
        if (r.reg_product_reg_country) {
          for (let c of r.reg_product_reg_country) {
            reg_country.push(c.country_code)
          }
        }
      }
    }
    const modal = this.modalService.create({
      nzTitle: '增加注册国家',
      nzMaskClosable: false,
      nzClosable: false,
      nzContent: AddCountryComponent,
      nzComponentParams: {
        id: this.productId,
        reg_country: reg_country ? reg_country : null
      },
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
          }        },
      ]
    });

    // 模态框返回数据
    modal.afterClose.subscribe((result) => {
      // 如果正常返回，刷新注册产品数据
      if (result) {
        if (result.data === 'ok') {
          this.productService.getProductById(this.productId).subscribe(
            val => {
              this.product.product_reg_product = val.product_reg_product;
            },
            err => {
              this.message.create('error', `请求异常 ${err.statusText}`);
              this.isSpinning = false;
            },
            () => this.isSpinning = false
          );
        }
      }
    });
  }

  /**
   * 增加关联供应商
   * */
  addProductSupplier(): void {

    const modal = this.modalService.create({
      nzTitle: '增加关联供应商',
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 600,
      nzContent: ProductSupplierAddComponent,
      nzComponentParams: {
        productId: this.productId,
        product_supplier: this.product.product_sup_product ? this.product.product_sup_product : null
      },
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
          }        },
      ]
    });

    // 模态框返回数据
    modal.afterClose.subscribe((result) => {
      // 如果正常返回，刷新关联供应商数据
      if (result) {
        if (result.data === 'ok') {
          this.refreshProductSupplier();
        }
      }
    });
  }

  /**
   * 编辑关联供应商采购链接
   * */
  editProductSupplier(product_sup): void {

    const modal = this.modalService.create({
      nzTitle: '编辑关联供应商',
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 600,
      nzContent: ProductSupplierEditComponent,
      nzComponentParams: {
        product_supplier: product_sup
      },
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
          }        },
      ]
    });

    // 模态框返回数据
    modal.afterClose.subscribe((result) => {
      // 如果正常返回，刷新关联供应商数据
      if (result) {
        if (result.data === 'ok') {
          this.refreshProductSupplier();
        }
      }
    });
  }

  /**
   * 解除关联供应商
   * */
  deleteProductSupplier(id): void {
    this.modalService.confirm({
      nzTitle: '<i>是否确认解除该供应商?</i>',
      nzContent: '<b>解除后可重新绑定</b>',
      nzOnOk: () => {
        this.productService.deleteSupplierProduct(id).subscribe(
            val => {
              console.log(val.status);
              if (val.status === 204) {
                this.message.create('success', '删除成功！');
                this.refreshProductSupplier(); // 刷新数据
              } else {
                this.message.create('error', `请求异常 ${val.statusText}`);
              }
            },
            err => {
              this.message.create('error', `请求异常 ${err.statusText}`);
            }
          );

      }
    });
  }

  /**
   * 刷新关联供应商数据
   * */
  refreshProductSupplier() {
    this.productService.getProductById(this.productId).subscribe(
      val => {
        this.product.product_sup_product = val.product_sup_product;
      },
      err => {
        this.message.create('error', `请求异常 ${err.statusText}`);
        this.isSpinning = false;
      },
      () => this.isSpinning = false
    );
  }

  /**
   * 设置默认关联供应商
   * */
  setDefaultSupplier(set_id: number) {

    for (let sup of this.product.product_sup_product) {
      if (sup.primary_supplier) {
        this.remove_id = sup.id;
      }
    }

    this.productService.setDefaultSupplier({set_id: set_id, remove_id: this.remove_id}).subscribe(
      val => {
        if (val.status === 200) {
          this.refreshProductSupplier(); // 刷新数据
        }
      },
      err => {
        console.log(err)
      }
    );
  }

  /**
   * 本窗口确认提交
   * */
  destroyModal(): void {
    if (this.formModel.valid) {
      this.checkVsku();
      this.isSpinning = true;
      this.productService.updateProduct(this.formModel.value).subscribe(
        val => {
          if (val.status === 200) {
            this.modal.destroy({ data: 'ok' });
          }
        },
        err => {
          this.message.create('error', `请求异常 ${err.statusText}`);
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
