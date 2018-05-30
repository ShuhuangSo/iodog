import {Component, OnInit, TemplateRef} from '@angular/core';
import {NzModalRef, NzModalService} from 'ng-zorro-antd';
import {AddCountryComponent} from '../products/add-country/add-country.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
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
    }
  ];
  tplModal: NzModalRef;
  tplModalButtonLoading = false;
  htmlModalVisible = false;

  constructor(private modalService: NzModalService) { }

  ngOnInit() {
  }

    createComponentModal(): void {
      const modal = this.modalService.create({
        // nzTitle: 'Modal Title',
        nzClosable: false,
        nzContent: AddCountryComponent,
        nzComponentParams: {
          title: 'title in component',
          subtitle: 'component sub title，will be changed after 2 sec'
        },
        nzFooter: [
          {
            label: 'Close',
            shape: 'default',
            onClick: () => modal.destroy()
          },
          {
            label: 'Confirm',
            type: 'primary',
            onClick: (componentInstance) => {
              componentInstance.destroyModal();
            }        },
        ]
      });

    // Return a result when closed
    modal.afterClose.subscribe((result) => {
      console.log('[afterClose] The result is:', result);
      if (result) {
        this.data.push(result.data);
      }
      console.log(this.data);
    });
  }

  createTplModal(tplTitle: TemplateRef<{}>, tplContent: TemplateRef<{}>, tplFooter: TemplateRef<{}>): void {
    this.tplModal = this.modalService.create({
      nzTitle: tplTitle,
      nzContent: tplContent,
      nzFooter: tplFooter,
      nzMaskClosable: false,
      nzClosable: false,
      nzOnOk: () => console.log('Click ok')
    });
  }

  destroyTplModal(): void {
    this.tplModalButtonLoading = true;
    window.setTimeout(() => {
      this.tplModalButtonLoading = false;
      this.tplModal.destroy();
    }, 1000);
  }
}
