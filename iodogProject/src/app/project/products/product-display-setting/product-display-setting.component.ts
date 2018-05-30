import {Component, Input, OnInit} from '@angular/core';
import {NzModalRef} from 'ng-zorro-antd';

@Component({
  selector: 'app-product-display-setting',
  templateUrl: './product-display-setting.component.html',
  styleUrls: ['./product-display-setting.component.css']
})
export class ProductDisplaySettingComponent implements OnInit {
  @Input()
  display: {};

  constructor(private modal: NzModalRef) { }

  ngOnInit() {
  }

  destroyModal(): void {
    this.modal.destroy({ data: this.display });
  }

}
