import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UsersService} from '../../shared/users.service';

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

  constructor(fb: FormBuilder,
              private router: Router,
              private usersService: UsersService
  ) {
    this.validateForm = fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
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

      this.usersService.userLogin(this.validateForm.value).subscribe(
        value => {
          console.log(value)
          if (value.status === 200) {
            // 登陆验证成功，保存token和用户名
            localStorage.setItem('auth_token', value.body.token);
            localStorage.setItem('username', this.validateForm.value.username);
            this.router.navigate(['home']);
          } else {
            console.log('else' + value.body);
          }
        },
        err => {
          console.log(err.error.non_field_errors)
          this.error_status = true;
          this.error_message = err.error.non_field_errors;
          this.isLogging = false;
        },
        () => this.isLogging = false
      );

    }
  }

}
