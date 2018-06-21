/*
* Created by shuhuang So
* Created Date: 2018/6/20
*/
import {
  HttpRequest,
  HttpHandler,
  HttpEvent, HttpInterceptor
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';
import {tap} from 'rxjs/operators';

@Injectable()
export class JWTInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  // 获取本地存储token
  getToken(): string {
    const auth_token = localStorage.getItem('auth_token');
    if (auth_token && auth_token !== 'undefined' && auth_token !== 'null') {
      return auth_token;
    } else {
      return '';
    }
  }

  // 请求,响应拦截器
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const JWT = `JWT ${this.getToken()}`;
    req = req.clone({
      setHeaders: {
        Authorization: JWT,
        'Content-Type': 'application/json'
      }
    });

    return next.handle(req).pipe(
      tap(
        // Succeeds when there is a response; ignore other events
        event => {},
        // Operation failed; error is an HttpErrorResponse
        error => {
          console.log(error.status)
          if (error.status === 401) {
            this.router.navigate(['login']);
          }
        }
      ));

  }
}
