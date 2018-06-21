/************
 头部组件
 *************/
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output()
  toggle = new EventEmitter<void>();

  constructor(private router: Router) { }

  ngOnInit() {
  }

  // 切换左侧导航菜单
  sideToggle() {
    this.toggle.emit();
  }

  // 获取本地存储username
  getUser(): string {
    const username = localStorage.getItem('username');
    if (username && username !== 'undefined' && username !== 'null') {
      return username;
    } else {
      return '';
    }
  }

  // 退出登录
  logout() {
    localStorage.removeItem('auth_token');
    this.router.navigate(['login']);
  }

}
