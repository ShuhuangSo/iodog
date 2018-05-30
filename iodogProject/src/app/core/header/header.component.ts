/************
 头部组件
 *************/
import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output()
  toggle = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  sideToggle() {
    this.toggle.emit();
  }
}
