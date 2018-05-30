import {Component, Input, OnInit} from '@angular/core';
import {NzModalRef} from 'ng-zorro-antd';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-add-country',
  templateUrl: './add-country.component.html',
  styleUrls: ['./add-country.component.css']
})
export class AddCountryComponent implements OnInit {
  @Input() country: [{}];
  regInfo = [
    {country_name: '澳大利亚', country_code: 'AU'},
    {country_name: '美国', country_code: 'US'},
    {country_name: '德国', country_code: 'DE'},
    {country_name: '英国', country_code: 'UK'},
  ];
  formModel: FormGroup;

  constructor(fb: FormBuilder,
              private modal: NzModalRef) {
    this.formModel = fb.group({
      key: ['9'],
      country_code: ['', [Validators.required]],
      import_value: ['', [Validators.required]],
      import_rate: [''],
      reg_status: ['待审核']
    });
  }

  ngOnInit() {
  }

  destroyModal(): void {
    this.modal.destroy({ data: this.formModel.value });
  }

}
