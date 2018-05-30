import {Component, Input, OnInit} from '@angular/core';
import {NzModalRef} from 'ng-zorro-antd';

@Component({
  selector: 'app-list-display-setting',
  templateUrl: './list-display-setting.component.html',
  styleUrls: ['./list-display-setting.component.css']
})
export class ListDisplaySettingComponent implements OnInit {
  @Input()
  display: {};

  constructor(private modal: NzModalRef) { }

  ngOnInit() {
  }

  destroyModal(): void {
    this.modal.destroy({ data: this.display });
  }


}
