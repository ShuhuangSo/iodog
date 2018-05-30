import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  isLoading = false; // 加载动画状态

  isHidden = false; // 侧边菜单收起状态

  constructor() { }

  ngOnInit() {
  }

  sidenavToggle() {
    this.isHidden = !this.isHidden;
  }
}
