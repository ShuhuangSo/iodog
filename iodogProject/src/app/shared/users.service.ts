import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class UsersService {

  constructor(private http: HttpClient) { }

  /**
   * 用户登录
   * */
  userLogin(form: any): Observable<any> {
    return this.http.post('/api/login/', JSON.stringify(form), {observe: 'response'});
  }

}
