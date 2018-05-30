import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {AddCountryComponent} from '../add-country/add-country.component';
import {sliceName} from '../../../utils/tools';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  formModel: FormGroup;

  // 注册国家数据列表
  data = [
    {
      key    : '1',
      country_code: 'AU',
      import_value: '0.3',
      import_rate: '0',
      reg_status: '已发布'
    }, {
      key    : '2',
      country_code: 'US',
      import_value: '0.3',
      import_rate: '5',
      reg_status: '待审核'
    },
    {
      key    : '8',
      country_code: 'RY',
      import_value: '0.9',
      import_rate: '15',
      reg_status: '待审核'
    }
  ];
  // 供应商数据列表
  suppliers = [
    {
      key    : '1',
      name    : '东涛',
      buy_url: 'http://vip.mabangerp.com/index.php?mod=stock.modify&id=802747',
      primary_supplier: true,
      buy_way: '1688',
    }, {
      key    : '2',
      name    : '西西里',
      buy_url: 'http://localhost:4200/home/product',
      primary_supplier: false,
      buy_way: 'QQ',
    }
  ];

  // 虚拟sku数据列表
  tags = [ 'N236BK-THI-ART', 'N237BK-THI-ART', 'N238BK-THI-ART' ];
  inputVisible = false;
  inputValue = '';
  @ViewChild('inputElement') inputElement: ElementRef;


  constructor(fb: FormBuilder,
              private message: NzMessageService,
              private modalService: NzModalService) {
    this.formModel = fb.group({
      sku: [''],
      cn_name: [''],
      status: [''],
      cost: [''],
      create_time: [''],
      vsku: [this.suppliers],
      en_name: [''],
      declared_value: [''],
      url: [''],
      length: [''],
      width: [''],
      heigth: [''],
      weight: [''],
      is_battery: [false],
      is_jack: [false],
      is_brand: [false],
      brand_name: [''],
      brand_model: ['']
    });
  }

  ngOnInit() {
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
    if (this.tags.indexOf(this.inputValue) !== -1) {
      this.message.error('该虚拟SKU已存在');
    }
    if (this.inputValue && this.tags.indexOf(this.inputValue) === -1) {
      this.tags.push(this.inputValue);
    }
    this.inputValue = '';
    this.inputVisible = false;
  }

  // 增加注册国家
  addCountry(): void {
    const modal = this.modalService.create({
      nzTitle: '增加注册国家',
      nzMaskClosable: false,
      nzClosable: false,
      nzContent: AddCountryComponent,
      nzComponentParams: {
        country: this.data,
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
          onClick: (componentInstance) => {
            componentInstance.destroyModal();
          }        },
      ]
    });

    // 模态框返回数据
    modal.afterClose.subscribe((result) => {
      if (result) {
        // this.data.push(result.data);
        this.data = [...this.data, {
          key: result.data.key,
          country_code: result.data.country_code,
          import_value: result.data.import_value,
          import_rate: result.data.import_rate,
          reg_status: result.data.reg_status
        }];
      }
    });
  }

}
