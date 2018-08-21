import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class SettingsService {

  constructor(private http: HttpClient) { }

  /**
   * 获取物流授权列表
   * */
  getLogisticsAuth(): Observable<any> {
    return this.http.get(`api/logistics-auth`);
  }

  /**
   * 修改物流授权
   * */
  updateLogisticsAuth(form: any): Observable<any> {
    return this.http.patch(`api/logistics-auth/${form.id}/`, JSON.stringify(form), {observe: 'response'});
  }

  /**
   * 获取物流授权by id
   * */
  getLogisticsAuthById(id: number): Observable<any>  {
    return this.http.get(`api/logistics-auth/${id}`);
  }

}


// 物流授权列表
export class LogisticsAuth {
  constructor(
    public id: number, // id
    public logistics_company: string, // 物流公司
    public logistics_code: string, // 物流代码
    public auth_time: string, // 授权时间
    public exp_time: string, // 过期时间
    public app_key: string, // 物流用户账号
    public token: string, // token
    public auth_link: string, // 授权链接
    public auth_status: boolean, // 授权状态
  ) {}
}
