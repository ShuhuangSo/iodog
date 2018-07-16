import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NzMessageService, NzModalRef, NzModalService} from 'ng-zorro-antd';
import {Combo, ComboInsideSKU, ProductService} from '../../../shared/product.service';
import {sliceName} from '../../../utils/tools';
import {ProductSearchComponent} from '../product-search/product-search.component';
import {ProductDetailComponent} from '../product-detail/product-detail.component';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-combo-newadd',
  templateUrl: './combo-newadd.component.html',
  styleUrls: ['./combo-newadd.component.css']
})
export class ComboNewaddComponent implements OnInit {
  isSpinning = false; // 加载状态
  formModel: FormGroup;
  add_product_formModel: FormGroup;
  add_err = false; // 添加产品错误状态
  err_contect = ''; // 添加产品错误内容
  add_loading = false; // 添加产品loading
  editCache_quantity = 1; // 编辑数量
  combo: Combo[];
  combo_pack_sku = [];

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
    private modal: NzModalRef,
    private modalService: NzModalService,
    private productService: ProductService,
    private message: NzMessageService,
    private fb: FormBuilder) { }

  ngOnInit() {
    // 新增组合产品
    this.add_product_formModel = this.fb.group({
      sku: ['', [Validators.required]],
      quantity: ['', [Validators.required]]
    });
    this.formModel = this.fb.group({
      combo_code: ['', [Validators.required, Validators.maxLength(30)], [this.comboCodeAsyncValidator]],
      combo_name: ['', [Validators.maxLength(50)]],
      combo_pack_vcombo: [this.tags],
      combo_pack_sku: ['']
    });
  }

  // 获取FormControl
  getFormControl(name) {
    return this.formModel.controls[ name ];
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

  // 输入虚拟组合sku回车确认
  handleInputConfirm(): void {
    if (this.inputValue) {
      this.vsku_loading = true;
      this.productService.checkVsku(this.inputValue).subscribe(
        val => {
          if (val.status === 200 || this.tags.indexOf(this.inputValue) !== -1) {
            this.vsku_err_status = true;
            this.inputElement.nativeElement.focus();
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

  // 开始编辑数量
  startEdit(sku: string): void {
    const pack = this.combo_pack_sku.find(item => item.sku === sku);
    pack.edit = true;
    this.editCache_quantity = pack.quantity;
  }

  // 完成编辑数量
  finishEdit(sku: string): void {
    const pack = this.combo_pack_sku.find(item => item.sku === sku)
    pack.edit = false;
    pack.quantity = this.editCache_quantity;
  }

  /**
   * 添加组合内sku
   * */
  addSKU() {
    this.add_err = false;
    if (this.add_product_formModel.valid) {
      // 检查添加的sku是否已存在
      if (this.combo_pack_sku) {
        for (let i of this.combo_pack_sku) {
          if (i.sku === this.add_product_formModel.value.sku.trim()) {
            this.add_err = true;
            this.err_contect = 'SKU重复添加';
          }
        }
      }

      if (!this.add_err) {
        this.add_loading = true;
        const urlparams = new URLSearchParams();
        urlparams.append('sku', this.add_product_formModel.value.sku.trim());
        this.productService.getProductBySku(urlparams.toString()).subscribe(
          val => {
            if (val.results.length) {
              console.log(val.results[0])
              this.combo_pack_sku = [ ...this.combo_pack_sku, {
                product_id: val.results[0].id,
                sku: val.results[0].sku,
                cn_name: val.results[0].cn_name,
                image: val.results[0].image,
                quantity: this.add_product_formModel.value.quantity,
                id: null,
                edit: false
              } ]
              this.add_product_formModel.reset();
            } else {
              this.add_err = true;
              this.err_contect = 'SKU不存在';
            }
          },
          err => console.log(err),
          () => this.add_loading = false
        );
      }
    } else {
      for (const key in this.add_product_formModel.controls) {
        this.add_product_formModel.controls[key].markAsDirty();
        this.add_product_formModel.controls[key].updateValueAndValidity();
      }
    }
  }

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
        this.add_product_formModel.patchValue({sku: result.sku});
      }
    });

  }

  /**
   * 删除组合内sku
   * */
  deleteSKU(val: string) {
    this.combo_pack_sku = this.combo_pack_sku.filter(pack => pack.sku !== val);
  }

  /**
   * 查看、编辑商品详情弹框
   * */
  editProduct(id: number): void {
    const modal = this.modalService.create({
      nzTitle: '商品详情',
      nzMaskClosable: true,
      nzClosable: true,
      nzWidth: '90%',
      nzStyle: {top: '20px'},
      nzContent: ProductDetailComponent,
      nzComponentParams: {
        productId: id,
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
          }
        },
      ]
    });

    // 模态框返回数据
    modal.afterClose.subscribe((result) => {
      // 如果正常返回，刷新产品列表数据
      if (result) {
        if (result.data === 'ok') {
          this.message.create('success', '产品修改成功！');
        }
      }
    });
  }

  /**
   * 异步校验组合编码是否存在
   * */
  comboCodeAsyncValidator = (control: FormControl) => Observable.create((observer) => {
    setTimeout(() => {
      this.productService.checkVsku(control.value).subscribe(
        value => {
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
    this.formModel.patchValue({combo_pack_sku: this.combo_pack_sku})

    if (this.formModel.valid) {
      if (!this.combo_pack_sku.length) {
        this.add_err = true;
        this.err_contect = '组合内SKU不能为空';
      } else {
        console.log(this.formModel.value)
        this.isSpinning = true;
        this.productService.addCombopack(this.formModel.value).subscribe(
          val => {
            if (val.status === 201) {
              this.modal.destroy({ data: 'ok' });
            }
          },
          err => {
            this.message.create('error', `请求异常 ${err.statusText}`);
            this.isSpinning = false;
          },
          () => this.isSpinning = false
        );
      }
    } else {
      for (const key in this.formModel.controls) {
        this.formModel.controls[key].markAsDirty();
        this.formModel.controls[key].updateValueAndValidity();
      }
    }
  }

}
