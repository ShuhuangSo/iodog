import {Component, Input, OnInit} from '@angular/core';
import {NzModalRef} from 'ng-zorro-antd';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProductService} from '../../../shared/product.service';

@Component({
  selector: 'app-add-country',
  templateUrl: './add-country.component.html',
  styleUrls: ['./add-country.component.css']
})
export class AddCountryComponent implements OnInit {
  @Input() id: number;
  @Input() reg_country: any;
  isSpinning = false; // 加载状态
  regInfo = [
    {country_name: '澳大利亚', country_code: 'AU'},
    {country_name: '美国', country_code: 'US'},
    {country_name: '德国', country_code: 'DE'},
    {country_name: '英国', country_code: 'UK'},
  ];
  formModel: FormGroup;

  constructor(private fb: FormBuilder,
              private productService: ProductService,
              private modal: NzModalRef) {
  }

  ngOnInit() {
    this.formModel = this.fb.group({
      product: [this.id],
      country_code: ['', [Validators.required]],
      import_value: ['', [Validators.required]],
      logistics_company: ['万邑通'],
    });

  }

  // 检查注册国家是否存在
  checkCountry(code: string): boolean {
    if (this.reg_country) {
      for (let c of this.reg_country) {
        if (code === c) {
          return true;
        }
      }
    }
    return false;
  }

  destroyModal(): void {
    // 提交保存注册国家
    if (this.formModel.valid) {
      this.isSpinning = true;
      this.productService.regProduct(this.formModel.value).subscribe(
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
