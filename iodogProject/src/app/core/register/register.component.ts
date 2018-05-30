/*************
 * 用户注册模块
 * ************/

import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {emailValidator} from '../../utils/validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  formModel: FormGroup;

  constructor(fb: FormBuilder) {
    this.formModel = fb.group({
      username: ['', [ Validators.required, emailValidator, Validators.maxLength(30) ], [ this.userNameAsyncValidator ]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      pconfirm: ['', [ this.passwordConfirmationValidator ]]
    });
  }

  ngOnInit() {
  }

  // 表单提交
  submitForm = ($event, value) => {
    $event.preventDefault();

    for (const key in this.formModel.controls) {
      // 提交时不再做用户名异步校验
      if (key === 'username') {
        this.formModel.controls[ key ].clearAsyncValidators();
        this.formModel.controls[ key ].markAsDirty();
        this.formModel.controls[ key ].updateValueAndValidity();
        this.formModel.controls[ key ].setAsyncValidators(this.userNameAsyncValidator);
      }
      else{
        this.formModel.controls[ key ].markAsDirty();
        this.formModel.controls[ key ].updateValueAndValidity();
      }

    }
    if (this.formModel.valid) {
      console.log(value);
    }
  }

  // 获取FormControl
  getFormControl(name) {
    return this.formModel.controls[ name ];
  }

  // 异步校验用户名
  userNameAsyncValidator = (control: FormControl): any => {
    return Observable.create(function (observer) {
      setTimeout(() => {
        if (control.value === 'JasonWood@qq.com') {
          observer.next({ error: true, duplicated: true });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 1000);
    });
  }

  // 两次密码校验
  passwordConfirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.formModel.controls[ 'password' ].value) {
      return { confirm: true, error: true };
    }
  }

  // 更新确认密码状态
  validateConfirmPassword() {
    setTimeout(_ => {
      this.formModel.controls[ 'pconfirm' ].updateValueAndValidity();
    });
  }

}
