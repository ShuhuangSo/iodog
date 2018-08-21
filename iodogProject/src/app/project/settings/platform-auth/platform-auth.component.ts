import { Component, OnInit } from '@angular/core';
import {LogisticsAuth, SettingsService} from '../../../shared/settings.service';
import {NzModalService} from 'ng-zorro-antd';
import {PlatformAuthAddComponent} from '../platform-auth-add/platform-auth-add.component';

@Component({
  selector: 'app-platform-auth',
  templateUrl: './platform-auth.component.html',
  styleUrls: ['./platform-auth.component.css']
})
export class PlatformAuthComponent implements OnInit {
  logisticsAuth: LogisticsAuth[]; // 物流授权列表
  operating = false; // 操作loading状态

  constructor(private settingsService: SettingsService,
              private modalService: NzModalService) { }

  ngOnInit() {
    this.loadLogisticsAuth();
  }

  /**
   * 加载数据，供调用
   * */
  loadLogisticsAuth() {
    this.settingsService.getLogisticsAuth().subscribe(
      val => {
        this.logisticsAuth = val.results;

      },
      err => {
        console.log(err);
      }
    );
  }

  /**
   * 取消物流授权
   * */
  cancelLogisticsAuth(id: number): void {
    this.operating = true;
    const auth_info = {
      app_key: '',
      token: '',
      id: id,
      auth_status: false
    }
    this.settingsService.updateLogisticsAuth(auth_info).subscribe(
      val => {
        if (val.status === 200) {
          this.loadLogisticsAuth();
        } else {
          console.log(val);
        }
      },
      err => {
        console.log(err);
        this.operating = false;
      },
      () => this.operating = false
    );
  }

  /**
   * 取消物流授权确认框
   * */
  cancelConfirm(id): void {
    this.modalService.confirm({
      nzTitle: '<i>是否确认要取消授权?</i>',
      nzContent: '<b>取消授权后，将无法获取物流数据</b>',
      nzOnOk: () => {
        this.cancelLogisticsAuth(id);
      }
    });
  }

  /**
   * 添加、编辑授权
   * */
  addLogisAuth(id: number, auth_link: string): void {
    if (auth_link) {
      window.open(auth_link, '_blank');
    }
    const modal = this.modalService.create({
      nzTitle: '物流授权',
      nzMaskClosable: false,
      nzClosable: true,
      nzWidth: '500px',
      nzContent: PlatformAuthAddComponent,
      nzComponentParams: {
        id: id,
        mode: 'LOGIS'
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
      if (result) {
        this.loadLogisticsAuth();
      }
    });

  }

}
