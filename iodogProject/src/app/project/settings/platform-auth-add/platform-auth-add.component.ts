import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzModalRef} from 'ng-zorro-antd';
import {LogisticsAuth, SettingsService} from '../../../shared/settings.service';

@Component({
  selector: 'app-platform-auth-add',
  templateUrl: './platform-auth-add.component.html',
  styleUrls: ['./platform-auth-add.component.css']
})
export class PlatformAuthAddComponent implements OnInit {
  @Input() id: number;
  @Input() mode: string;
  isSpinning = false; // 加载状态
  formModel: FormGroup;

  logisticsAuth: LogisticsAuth

  constructor(private fb: FormBuilder,
              private settingsService: SettingsService,
              private modal: NzModalRef) { }

  ngOnInit() {
    // 物流授权
    if (this.mode === 'LOGIS') {
      this.isSpinning = true;
      this.settingsService.getLogisticsAuthById(this.id).subscribe(
        val => {
          console.log(val)
          this.logisticsAuth = val;
        },
        err => {
          console.log(err);
          this.isSpinning = false;
        },
        () => {
          // 表单初始化
          this.formModel.patchValue(this.logisticsAuth);
          this.formModel.patchValue({'auth_status' : true});
          this.isSpinning = false;
        }
      );
      this.formModel = this.fb.group({
        app_key: ['', Validators.required],
        token: ['', Validators.required],
        auth_status: [true],
        id: [this.id]
      });
    }


  }

  /**
   * 修改物流授权
   * */
  editLogisticsAuth(): void {
    this.isSpinning = true;
    this.settingsService.updateLogisticsAuth(this.formModel.value).subscribe(
      val => {
        if (val.status === 200) {
          this.modal.destroy({ data: 'ok' });
        } else {
          console.log(val);
        }
      },
      err => {
        console.log(err);
        this.isSpinning = false;
      },
      () => this.isSpinning = false
    );
  }

  destroyModal(): void {
    if (this.formModel.valid) {
      if (this.mode === 'LOGIS') {
        this.editLogisticsAuth();
        console.log(this.formModel.value)
      } else {
        console.log(this.formModel.value)
      }
    } else {
      for (const key in this.formModel.controls) {
        this.formModel.controls[key].markAsDirty();
        this.formModel.controls[key].updateValueAndValidity();
      }
    }
  }

}
