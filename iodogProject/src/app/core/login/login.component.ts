import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  validateForm: FormGroup;

  error_message: String = '';
  error_status: Boolean = false;
  isLogging: Boolean = false;

  constructor(fb: FormBuilder, private router: Router) {
    this.validateForm = fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      remember: [false]
    });
  }

  ngOnInit() {
  }

  // 获取FormControl
  getFormControl(name) {
    return this.validateForm.controls[ name ];
  }

  // 表单提交
  submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      this.isLogging = true;
      this.error_status = false;
      setTimeout(_ => {
        // this.router.navigate(['/home']);
        this.isLogging = false;
        this.error_status = true;
        this.error_message = '用户名或密码错误';
      }, 5000);
      console.log(this.validateForm.value);
    }
  }

}
