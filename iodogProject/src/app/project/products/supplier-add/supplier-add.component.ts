import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzModalRef} from 'ng-zorro-antd';

@Component({
  selector: 'app-supplier-add',
  templateUrl: './supplier-add.component.html',
  styleUrls: ['./supplier-add.component.css']
})
export class SupplierAddComponent implements OnInit {
  formModel: FormGroup;

  constructor(private modal: NzModalRef,
              fb: FormBuilder) {
    this.formModel = fb.group({
      supplier_name: [''],
      buy_way: [''],
      store_url: [''],
      address: [''],
      qq: [''],
      phone: [''],
      note: ['']
    });
  }

  ngOnInit() {
  }

  // 提交表单
  submitForm() {
    console.log(this.formModel.value);
  }

  destroyModal(): void {
    this.modal.destroy({ data: 123 });
  }

}
