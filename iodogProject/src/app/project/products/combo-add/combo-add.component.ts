import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {NzMessageService, NzModalRef, NzModalService} from 'ng-zorro-antd';
import {Combo, ProductService} from '../../../shared/product.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {sliceName} from '../../../utils/tools';
import {ProductSearchComponent} from '../product-search/product-search.component';

@Component({
  selector: 'app-combo-add',
  templateUrl: './combo-add.component.html',
  styleUrls: ['./combo-add.component.css']
})
export class ComboAddComponent implements OnInit {
  formModel: FormGroup;
  add_product_formModel: FormGroup;
  isSpinning = false; // 加载状态
  add_err = false; // 添加产品错误状态
  err_contect = ''; // 添加产品错误内容
  add_loading = false; // 添加产品loading

  editCache_quantity = 1; // 编辑数量

  @Input()
  combo: Combo

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

  init_combo_sku = []; // 初始组合内sku
  remove_combo_sku = []; // 删除的组合内sku
  edit_combo_sku = []; // 需要修改数量的组合内sku
  add_combo_sku = []; // 需要增加的组合内sku

  constructor(
    private modal: NzModalRef,
    private modalService: NzModalService,
    private productService: ProductService,
    private message: NzMessageService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    // 新增组合产品
    this.add_product_formModel = this.fb.group({
      sku: ['', [Validators.required]],
      quantity: ['', [Validators.required]]
    });
    if (this.combo) {
      // 编辑组合
      this.formModel = this.fb.group({
        id: [this.combo.id],
        combo_code: [this.combo.combo_code, [Validators.required, Validators.maxLength(30)]],
        combo_name: [this.combo.combo_name, [Validators.maxLength(50)]],
        remove_combo_sku: [this.remove_combo_sku],
        edit_combo_sku: [this.edit_combo_sku],
        add_combo_sku: [this.add_combo_sku],
        add_vsku: [this.add_vsku],
        remove_vsku: [this.remove_vsku]
      });
      // 虚拟sku赋值
      for (let vs of this.combo.combo_pack_vcombo) {
        this.tags.push(vs.vsku);
        this.vskus.push(vs.vsku);
      }
      // 组合内sku赋值
      for (let item of this.combo.combo_pack_sku) {
        this.init_combo_sku.push(item)
      }
    }
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

  /**
   * 获取虚拟sku的删除和增加
   * */
  checkVsku() {
    // 获取删除的虚拟sku
    for (let vs of this.combo.combo_pack_vcombo) {
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
   * 获取组合内sku的删除，增加，修改
   * */
  checkCombosku() {

    for (let vs of this.init_combo_sku) {
      const pack_sku = this.combo.combo_pack_sku.find(item => item.sku === vs.sku)
      // 如果找不到，则进入删除列表
      if (!pack_sku) {
        this.remove_combo_sku.push(vs.sku);
      }
    }
    // 需要添加的sku
    for (let s of this.combo.combo_pack_sku) {
      const p_sku = this.init_combo_sku.find(item => item.sku === s.sku)
      if (!p_sku) {
        this.add_combo_sku.push({'sku': s.sku, 'quantity': s.quantity})
      }
    }
  }

  // 开始编辑数量
  startEdit(sku: string): void {
    const pack = this.combo.combo_pack_sku.find(item => item.sku === sku);
    pack.edit = true;
    this.editCache_quantity = pack.quantity;
  }

  // 完成编辑数量
  finishEdit(sku: string): void {
    const pack = this.combo.combo_pack_sku.find(item => item.sku === sku)
    pack.edit = false;
    pack.quantity = this.editCache_quantity;

    const p_sku = this.init_combo_sku.find(item => item.sku === sku)
    if (p_sku) {
      this.edit_combo_sku.push({'sku': sku, 'quantity': this.editCache_quantity})
    }
  }

  /**
   * 添加组合内sku
   * */
  addSKU() {
    this.add_err = false;
    if (this.add_product_formModel.valid) {
      // 检查添加的sku是否已存在
      if (this.combo.combo_pack_sku.length) {
        for (let i of this.combo.combo_pack_sku) {
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
              this.combo.combo_pack_sku = [ ...this.combo.combo_pack_sku, {
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
        console.log('1：' + result.sku);
        this.add_product_formModel.patchValue({sku: result.sku});
      }
    });

  }

  /**
   * 删除组合内sku
   * */
  deleteSKU(val: string) {
    this.combo.combo_pack_sku = this.combo.combo_pack_sku.filter(pack => pack.sku !== val);
  }

  // 确认提交
  destroyModal(): void {
    this.checkVsku()
    this.checkCombosku()
    if (!this.combo.combo_pack_sku.length) {
      this.add_err = true;
      this.err_contect = '组合内SKU不能为空';
    } else {
      this.isSpinning = true;
      this.productService.updateCombopack(this.formModel.value).subscribe(
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
    }

  }

}
